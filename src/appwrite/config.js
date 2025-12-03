import conf from "../config/config";
import {Client, Account, ID, Storage, Query, Databases} from 'appwrite';


export class Service{
    client  = new Client();
    databases;
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status,
        userID
    }){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionID, slug, {
                title,
                content,
                featuredImage,
                status, userID
            })
        } catch (error) {
            console.log("Appwrite: service:: create post error", error);
        }


    }

    async updatePost(slug, {title, content, featuredImage, status}){
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionID,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status
                    }
                )
            } catch (error) {
                console.log("Appwrite: service:: update post error", error);
            }
        }

        async deletePost(slug){
            try {
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionID,
                    slug
                )
                return true;
            } catch (error) {
                console.log("Appwrite: service:: delete post error", error);
                return false;
            }
        }

        async getPost(slug){
            try {
                return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionID,
                    slug
                )
            } catch (error) {
                console.log("Appwrite: service:: get post error", error);
                return false;
            }
        }

        async getPosts(queries = [Query.equal("status", "active")]){
            try {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionID,
                    queries,
                )
            } catch (error) {
                console.log("Appwrite: service:: get posts error", error);
                return false;
            }

        }

        //file upload services
        async uploadFile(file){
            try {
                return await this.bucket.createFile(
                    conf.appwriteBucketId,
                    ID.unique(),
                    file,
                )
            } catch (error) {
                console.log("Appwrite: service:: upload file error", error);
                return false;
            }
        }

        async deleteFile(fileId){
            try {
                await this.bucket.deleteFile(
                    conf.appwriteBucketId,
                    fileId,
                )
            } catch (error) {
                console.log("Appwrite: service:: delete file error", error);
                return false;
            }
        }

        getFilePreview(fileId){
            return this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId
            )
        }
}


export const service = new Service();
export default service;