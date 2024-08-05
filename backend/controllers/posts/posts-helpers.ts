import * as crypto from "crypto";

// Function to hash a string with SHA-256 and take the first 24 characters
export function hashStringToObjectId(name_of_the_post: string): string {
  // Convert the name_of_the_post to a UTF-8 encoded buffer
  const buffer = Buffer.from(name_of_the_post, "utf-8");

  // Generate SHA-256 hash
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");

  // Take the first 24 characters of the hash
  const objectIdHex = hash.slice(0, 24);

  return objectIdHex;
}

export const getExcludedData = (includeSavedUsers: boolean) => {
  return includeSavedUsers
    ? { detail_title: 0, detail: 0 }
    : { detail_title: 0, detail: 0, saved_users: 0 };
};

export const getCategoryData = (includeSavedUsers: boolean) => {
  return includeSavedUsers
    ? { category_title: 0 }
    : { category_title: 0, saved_users: 0 };
};
