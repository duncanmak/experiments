interface Change { path: string; content: string }

class GitHubHelper {
    constructor(
        public token: string,
        public repo: string,
        public branch: string = 'master',
        public commits: Change[] = [],
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
        console.log('my branch', this.branch);

        let url = this.github(`repos/${this.repo}/git/refs`);
        let ref = `refs/heads/${this.branch}`;
        let refs = await (await fetch(url)).json();

        const has = (prop, value) => (obj) => obj[prop] === value;

        // TODO: find(refs, ['ref', 'refs/heads/master']) should work
        const master: any = refs.find(has('ref', 'refs/heads/master'));

        // TODO: some(refs, ['ref', ref]) should work
        if (refs.some(has('ref', ref))) {
            console.log(this.branch, 'already exists');
            return this.getInitialShas(this.branch);
        }

        // Make the new branch based on HEAD of master
        let {commitSha, treeSha} = await this.getInitialShas('master')
        let body = JSON.stringify({ref, sha: commitSha});
        console.log('body', body);

        await this.post(url, body);

        return {commitSha, treeSha};
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
        this.commits.push(c);
        return this;
    }

    async post(url, body: string, method = 'POST') {
        const headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `token ${this.token}`
        };
        return fetch(url, {method, headers, body});
    }

    async commit(message) {
        // Create a new tree for your commit
        let body = JSON.stringify({
            base_tree: this.initialTreeSha,
            tree: this.commits.map(c => Object.assign({mode: '100644', type: 'blob'}, c))
        });
        let r1 = await (await (this.post(this.github(`repos/${this.repo}/git/trees`), body))).json();

        // Create the commit
        let tree = r1.sha;
        let parents = [this.initialCommitSha];
        let commit = JSON.stringify({ message, tree, parents });
        let r2 = await (await this.post(this.github(`repos/${this.repo}/git/commits`), commit)).json();

        // Link commit to the reference
        body = JSON.stringify({sha: r2.sha});
        let r3 = await (await this.post(this.getReference(`heads/${this.branch}`), body, 'PATCH')).json();

        return r3;
    }
}

async function test(token, repo) {
    const helper = new GitHubHelper(token, repo, 'test');
    await helper.setup()

    console.log('object', helper.initialCommitSha, 'tree', helper.initialTreeSha);

    helper
        .change({path: 'foo', content: 'This is foo 2'})
        .change({path: 'bar', content: 'This is bar 2'});

    let result = await helper.commit('This is a message');
    console.log(JSON.stringify(result));
}

test('', '');