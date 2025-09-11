import mongoose from 'mongoose'

const Connect = async ()=> {
    try {
        await mongoose
          .connect("mongodb://localhost:27017/CodeFusion")
          .then(console.log("Connected with Mongodb"));
    } catch (error) {
        console.log(error)        
    }
}

export default Connect