export type empSchema = {
  id: number;
  name: string;
  age: number;
  email: string;
  position: string;
  salary: number;
  password: string;
  department: string;
  performance: string;
  joinDate?: string;
  prevpassword?: any;
};

export type updateSchema = {
  id?: number;
  name?: string;
  age?: number;
  email?: string;
  position?: string;
  salary?: number;
  password?: string;
  department?: string;
  performance?: string;
  joinDate?: string;
  prevPassword?: any;
};

export type historySchema = {
  id: number;
  empHistoryId: number;
  updatedOn: string;
  name?: {
    prevName: string;
    currentName: string;
  };
  salary?: {
    prevSalary: number;
    currentSalary: number;
  };
  age?: {
    prevAge: number;
    currentAge: number;
  };
  department?: {
    prevDpt: string;
    currentDpt: string;
  };
  position?: {
    prevPosition: string;
    currentPosition: string;
  };
  performance?: {
    prevPerformance: string | number;
    currentPerformance: string | number;
  };
  email?: {
    prevEmail: string;
    currentEmail: string;
  };
  password?: {
    prevpassword: any;
    currentpassword: any;
  };
};

export type dptSchema = "frontend" | "backend" | "fullstack";
export type posSchema = "SDE1" | "SDE2" | "SDE3";
