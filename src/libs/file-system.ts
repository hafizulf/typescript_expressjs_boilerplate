import { IMulterFile } from "@/modules/common/interfaces/multer-interface";
import path from "path";
import fs, { unlink } from "fs-extra";
import { AppError, HttpCode } from "@/exceptions/app-error";

export class FileSystem {
  public static getPath(file: IMulterFile, destination: string): string {
    return path.join(
      "storage",
      destination,
      `${file.filename}.${file.originalname.split(".").reverse()[0]}`
    )
  }

  public static store(file: IMulterFile, destination: string): string {
    const destinationPath = path.join(
      "storage",
      destination,
      `${file.filename}.${file.originalname.split(".").reverse()[0]}`
    )

    fs.moveSync(file.path, destinationPath);
    return destinationPath;
  }

  public static destroy(path: string): boolean {
    try {
      if(fs.pathExistsSync(path)) {
        unlink(path);
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  public static update(
    file: IMulterFile,
    destination: string,
    oldFile?: string
  ): string {
    if(oldFile) {
      if(fs.pathExistsSync(oldFile)) {
        unlink(oldFile);
      } else {
        throw new AppError({
          statusCode: HttpCode.NOT_FOUND,
          description: "File not found",
        })
      }
    }

    const destinationPath = path.join(
      "storage",
      destination,
      `${file.filename}.${file.originalname.split(".").reverse()[0]}`
    )

    fs.moveSync(file.path, destinationPath);
    return destinationPath;
  }
}
