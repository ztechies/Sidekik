import grid from 'gridfs-stream';
import mongoose from 'mongoose';
import { Response } from 'express';
import { config } from '../config/config';

let gfs: any, gridFsBucket: any;
const conn = mongoose.connection;

// conn.once('open', () => {
//     gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//         bucketName: 'photos'
//     });
//     gfs = grid(conn.db, mongoose.mongo);
//     gfs.collection('photos');
// });

const url = config.frontEndUrl.url;

const getFile = async (filename: string, res: Response) => {
    try {
        const file = await gfs.files.findOne({ filename: filename });
        if (!file) {
            console.error('File not found:', filename);
            res.status(404).send('File not found');
            return;
        }
        console.log('File found:', file);
        const readStream = gridFsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error in getFile service:', error);
        res.status(500).send(error);
    }
};

const uploadFile = async (filename: string | undefined) => {
    try {
        if (!filename) {
            throw new Error('File not found');
        }
        const fileUrl = `${url}/file/${filename}`;
        console.log('File URL:', fileUrl);
        return fileUrl;
    } catch (error) {
        console.error('Error in uploadFile service:', error);
        throw error;
    }
};

export default { getFile, uploadFile };