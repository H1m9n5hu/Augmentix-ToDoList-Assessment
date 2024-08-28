import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

const TaskModel = mongoose.model('tasks', TaskSchema);

export { TaskModel as Task };