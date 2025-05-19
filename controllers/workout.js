const Workout = require('../models/Workout'); 

exports.addWorkOut = async (req, res) => {
    try {
      console.log('Inside addWorkOut. req.user =', req.user); // Add this line
  
      const { name, duration } = req.body;
  
      if (!name || !duration) {
        return res.status(400).json({ message: 'Name and duration are required.' });
      }
  
      const userId = req.user.id; // <-- this should match `id` from your token
  
      const newWorkout = new Workout({
        userId,
        name,
        duration,
        status: 'pending'
      });
  
      const savedWorkout = await newWorkout.save();
  
      res.status(201).json(savedWorkout);
  
    } catch (error) {
      console.error('Error adding workout:', error.message);
      res.status(500).json({ message: 'Server error while adding workout.' });
    }
  };
  

  module.exports.getMyWorkouts = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const workouts = await Workout.find({ userId }).sort({ dateAdded: -1 }); // latest first
  
      res.status(200).json({ workouts });
    } catch (error) {
      console.error('Error fetching workouts:', error.message);
      res.status(500).json({ message: 'Server error while fetching workouts.' });
    }
  };
  


  exports.updateWorkout = async (req, res) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;
  
      // Optional: Only allow name and duration to be updated for now
      const { name, duration } = req.body;
  
      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: workoutId, userId }, // Ensure user can only update their own workout
        { name, duration },
        { new: true, runValidators: true }
      );
  
      if (!updatedWorkout) {
        return res.status(404).json({ message: 'Workout not found or unauthorized.' });
      }
  
      res.status(200).json({
        message: 'Workout updated successfully',
        updatedWorkout
      });
    } catch (error) {
      console.error('Error updating workout:', error.message);
      res.status(500).json({ message: 'Server error while updating workout' });
    }
  };

  exports.deleteWorkout = async (req, res) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;
  
      const deletedWorkout = await Workout.findOneAndDelete({
        _id: workoutId,
        userId: userId
      });
  
      if (!deletedWorkout) {
        return res.status(404).json({ message: 'Workout not found or unauthorized.' });
      }
  
      res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
      console.error('Error deleting workout:', error.message);
      res.status(500).json({ message: 'Server error while deleting workout.' });
    }
  };
  
  module.exports.completeWorkoutStatus = async (req, res) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;
      
      // Update status field only
      const { status } = req.body;  // Assuming status can be 'completed', 'pending', etc.
  

      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: workoutId, userId },
        { status },
        { new: true, runValidators: true }
      );
  
      if (!updatedWorkout) {
        return res.status(404).json({ message: 'Workout not found or unauthorized.' });
      }
  
      res.status(200).json({
        message: 'Workout status updated successfully',
        updatedWorkout
      });
    } catch (error) {
      console.error('Error updating workout status:', error.message);
      res.status(500).json({ message: 'Server error while updating workout status.' });
    }
  };
  
  
