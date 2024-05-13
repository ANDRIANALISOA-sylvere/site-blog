import mongoose from 'mongoose';
// import pinyin from 'pinyin';

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim:true
    },
    chinesename: {
      type: String,
      required: false,
      trim:true
    },
    birthday: {
        type: String,
        required: true,
        trim:true
      },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    gender: {
      type: String,
      required:true,
      trim:true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);



const Client = mongoose.model('Client', clientSchema);

export default Client;