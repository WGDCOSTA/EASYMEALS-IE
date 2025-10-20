
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createS3Client, getBucketConfig } from './aws-config'

const s3Client = createS3Client()

export async function uploadFile(buffer: Buffer, fileName: string) {
  const { bucketName, folderPrefix } = getBucketConfig()
  const key = `${folderPrefix}uploads/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
  })
  
  await s3Client.send(command)
  return key // This is the cloud_storage_path
}

export async function downloadFile(key: string) {
  const { bucketName } = getBucketConfig()
  
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })
  
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  return signedUrl
}

export async function deleteFile(key: string) {
  const { bucketName } = getBucketConfig()
  
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })
  
  await s3Client.send(command)
}

export async function renameFile(oldKey: string, newKey: string) {
  // S3 doesn't have a rename operation, so we copy and delete
  const { bucketName } = getBucketConfig()
  
  // First, get the object
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: oldKey,
  })
  
  const object = await s3Client.send(getCommand)
  
  if (!object.Body) {
    throw new Error('Object body is empty')
  }
  
  // Convert the body to Buffer
  const buffer = await object.Body.transformToByteArray()
  
  // Upload with new key
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: newKey,
    Body: buffer,
  })
  
  await s3Client.send(putCommand)
  
  // Delete the old object
  await deleteFile(oldKey)
  
  return newKey
}
