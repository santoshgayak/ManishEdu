export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    fName: string;
    lName: string;
    pNumber: number;
    password: string;
    profileImage: string;
    role: string;
    joinedDate: Date;
    accountStatus: string;
    notificationPreference: [
      {
        isEmailOn: boolean;
        isPhoneOn: boolean;
        isTransactionOn: boolean;
      },
    ];
    createdAt: Date;
    updatedAt: Date;
  };
}
