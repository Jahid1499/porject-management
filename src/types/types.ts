export type ErrorOrSuccessMessageType = {
    message: string
}

export type NodePropsTypes = {
    children: React.ReactNode
}

// export type TeamTypes = {
//     name: string,
//     color: string,
//     description: string,
//     timestamp: number,
//     id: number,
//     participants: string
// }

export type RegistrationResponseErrorTypes = {
    status: number,
    data: string,
}

export type ColumnPropsTypes = {
    children: React.ReactNode;
    className: string;
    title: string;
    totalItem: number;
    modalHandler?: () => void | undefined;
};

export interface Team {
    name: string,
    participants: string,
    color: string,
    description: string,
    timestamp: number,
    id: number,
}
export interface SingleTeam {
    name: string,
    id: number,
    color: string,
}
export interface Project {
    creator: {
        avatar: string
        email: string
    },
    team: SingleTeam,
    title: string,
    status: string,
    timestamp: string,
    id: number,
}

export type EditModalForProjectPropsTypes = {
    cancelEditHandler: () => void;
    submitHandler: (title: string, editedTeam: SingleTeam, id: number) => void;
    teams: Team[];
    data: Project;
};