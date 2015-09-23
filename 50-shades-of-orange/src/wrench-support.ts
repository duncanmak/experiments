export interface Log {
    build_host: string,
    build_host_id: number,
    branch: string,
    commit: string,
    completed: boolean,
    end_time: string,
    host: string,
    host_id: number,
    lane_id: number,
    lane_name: string,
    revision_id: number,
    repository: string,
    start_time: FunctionStringCallback,
    status: string,
    steps: Step[],
    url: string,
    generation_time: number;
}

export interface Step {
    duration: number;
    files: any,
    order: number,
    step: string,
    status: string
}