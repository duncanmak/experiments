import { isEqual } from 'lodash'

interface Change { path: string; content: string }

class GitHubHelper {
    constructor(
        public token: string,
        public repo: string,
        public branch: string = 'master',
        public changes: Change[] = [],
        public initialCommitSha?: string,
        public initialTreeSha?: string
    ) {
    }

    public async setup() {
        let {commitSha, treeSha} = await this.ensureBranchExists();
        this.initialCommitSha = commitSha;
        this.initialTreeSha = treeSha;
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

    // TODO: Think about caching
    async fetchContent(path: string) {
        if (path === undefined) {
            return;
        } else {
            console.log('fetching', path);

            let url = this.github(`repos/${this.repo}/contents/${path}`) + `&ref=${this.branch}`;
            let headers = this.headers({cache: 'no-cache', mode: 'cors'});
            let result = await (await fetch(url, {method: 'GET', headers})).json();
            let download_url = result.download_url + '?' + new Date().getTime(); // AKA MANUAL CACHE BUSTING
            let content = await (await fetch(download_url)).text();

            return {path, content};
        }
    }

    public async showFiles() {
        let promises = this.changes.map (c => this.fetchContent(c.path));
        console.log(JSON.stringify(await Promise.all(promises)));
    }

    difference(from, to) {
        return to.filter(i => {
            for (let f of from) {
                if (isEqual(f, i))
                    return false;
            }
            return true;
        })
    };

    async commit(message) {
        let changes = this.changes;
        let current = await Promise.all(changes.map(c => this.fetchContent(c.path)));
        let currentSet = new Set(current);
        let difference = this.difference(current, changes); // ORDER MATTERS!

        console.log('difference', JSON.stringify(difference));

        if (difference.length === 0) {
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

async function test(token, repo) {
    const helper = new GitHubHelper(token, repo, 'test');
    await helper.setup()

    helper
        .change({path: 'foo', content: 'This is foo 7'})
        .change({path: 'bar', content: 'This is bar 7'});

    let result = await helper.commit('This is a message');
    // console.log(JSON.stringify(result));

    // helper.showFiles();
}
