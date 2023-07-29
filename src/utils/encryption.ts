import * as bcrypt from "bcrypt";

export function encryptData(data: string): string {
  const salt = bcrypt.genSaltSync(10);
  const encryptedData = bcrypt.hashSync(data, salt);
  return encryptedData;
}

export function compareData(data: string, encryptedData: string): boolean {
  return bcrypt.compareSync(data, encryptedData);
}
