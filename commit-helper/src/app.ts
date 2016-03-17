import { isArray, isEmpty, isEqual, isFunction, isUndefined } from 'lodash'

export type ChangeAddedHandler = (c: Change) => void;
export interface Change { path: string; content: string }

export class GitHubHelper {

    changes: Change[] = [];
    initialCommitSha: string;
    initialTreeSha: string;
    onChangeAdded;

    constructor(
        public token: string,
        public repo: string,
        public branch: string = 'master'
    ) {
    }

    public async setup(onChangeAdded?: ChangeAddedHandler) {
        let {commitSha, treeSha} = await this.ensureBranchExists();
        this.initialCommitSha = commitSha;
        this.initialTreeSha = treeSha;
        this.onChangeAdded = onChangeAdded;
    }

    withToken    = (url)  => `${url}?access_token=${this.token}`;
    github       = (call) => this.withToken(`https://api.github.com/${call}`);
    getReference = (ref)  => this.github(`repos/${this.repo}/git/refs/${ref}`);

    async ensureBranchExists() {
        console.log('branch', this.branch);

        let url = this.github(`repos/${this.repo}/git/refs`);
        let ref = `refs/heads/${this.branch}`;
        let refs = await (await fetch(url)).json();

        const has = (prop, value) => (obj) => obj[prop] === value;

        if (refs.some(has('ref', ref))) {
            console.log(this.branch, 'already exists');
            return this.getInitialShas(this.branch);
        }

        // Make the new branch based on HEAD of master
        let {commitSha, treeSha} = await this.getInitialShas('master')
        let body = JSON.stringify({ref, sha: commitSha});
        console.log('body', body);

        let r1 = await (await this.post(url, body)).json();
        let r2 = await (await fetch(this.withToken(r1.object.url))).json();

        return {commitSha: r1.object.sha, treeSha: r2.tree.sha};
    }

    async getInitialShas(branch) {
        // Get the SHA of the latest commit on the branch
        let r1 = await (await fetch(this.getReference(`heads/${branch}`))).json();
        let commitSha = r1.object.sha;

        // Get the tree information for that commit
        let r2 = await (await fetch(this.withToken(r1.object.url))).json();
        let treeSha = r2.tree.sha;

        return {commitSha, treeSha};
    }

    change(c: Change) {
        this.changes.push(c);
        if (isFunction(this.onChangeAdded))
            this.onChangeAdded(c);

        return this;
    }

    async post(url, body: string, method = 'POST') {
        const headers = this.headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `token ${this.token}`
        });
        return fetch(url, {method, headers, body});
    }

    headers(h) {
        let headers = new Headers();
        for (let k of Object.keys(h)) {
            headers[k] = h[k];
        }
        return headers;
    }

    async fetchContent(path: string) {
        if (isUndefined(path)) {
            return;
        } else {
            console.log('fetching', path);

            let url = this.github(`repos/${this.repo}/contents/${path}`) + `&ref=${this.branch}`;

            // this doesn't work, see https://bugs.chromium.org/p/chromium/issues/detail?id=453190
            // let headers = this.headers({cache: 'no-cache', mode: 'cors'});
            let result = await (await fetch(url)).json();

            let download_url = result.download_url + '?' + new Date().getTime(); // AKA MANUAL CACHE BUSTING
            let content = await (await fetch(download_url)).text();

            return {path, content};
        }
    }

    public async listFiles(path?: string) {
            let url = this.github(`repos/${this.repo}/contents`) + `&ref=${this.branch}`;
            let result = await (await fetch(url)).json();

            if (isArray(result)) {
                return result;
            } else {
                let download_url = result.download_url + '?' + new Date().getTime(); // AKA MANUAL CACHE BUSTING
                return await (await fetch(download_url)).text();
            }
    }

    async commit(message) {

        // Compares two arrays of any, a, b, and returns new items in b.
        const diff = (a, b) => b.filter(i => {
            for (let item of a) {
                if (isEqual(item, i)) return false;
            }
            return true;
        });

        let changes = this.changes;
        let current = await Promise.all(changes.map(c => this.fetchContent(c.path)));
        let difference = diff(current, changes); // ORDER MATTERS!

        console.log('difference', JSON.stringify(difference));

        if (isEmpty(difference)) {
            console.log("Nothing new to commit");
            return;
        }

        // Create a new tree for your commit
        let body = JSON.stringify({
            base_tree: this.initialTreeSha,
            tree: this.changes.map(c => Object.assign({mode: '100644', type: 'blob'}, c))
        });
        let r1 = await (await (this.post(this.github(`repos/${this.repo}/git/trees`), body))).json();

        // Create the commit
        let tree = r1.sha;
        let parents = [this.initialCommitSha];
        let commit = JSON.stringify({ message, tree, parents });
        let r2 = await (await this.post(this.github(`repos/${this.repo}/git/commits`), commit)).json();

        console.log('commit', JSON.stringify(r2));

        // Link commit to the reference
        body = JSON.stringify({sha: r2.sha});
        let r3 = await (await this.post(this.getReference(`heads/${this.branch}`), body, 'PATCH')).json();

        return r3;
    }
}

