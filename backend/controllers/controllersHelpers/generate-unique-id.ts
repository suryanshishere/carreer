import crypto from "crypto";

const generateUniqueId = (post_code: string) => {
  // Create a SHA-256 hash
  const hash = crypto.createHash("sha256").update(post_code).digest("hex");

  // Optionally, shorten the hash or modify it to fit MongoDB's ObjectID length
  // MongoDB ObjectID is 24 hex characters long, we can take the first 24 characters
  const objectIdLike = hash.substring(0, 24);

  return objectIdLike;
};

export default generateUniqueId;
