export type Member = {
    name: string;
    first_name: string;
    email: string;
    phone: string;
    study: string;
    pmr: boolean;
    genre: "homme" | "femme" | "ne se prononce pas";
    teacher: string;
    nickname: string;
    comment: string;
    course: boolean;
    [key: string]: any;
};