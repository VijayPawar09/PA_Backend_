export const updateUser=async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let profile = {};
      if (user.userType === 'assistant') {
        const assistant = await Assistant.findOne({ userId: user._id });
        profile = { ...user.toObject(), ...assistant.toObject() };
      } else {
        const customer = await Customer.findOne({ userId: user._id });
        profile = { ...user.toObject(), ...customer.toObject() };
      }
  
      res.json(profile);
    } catch (err) {
      console.error('Profile error:', err.message);
      res.status(500).send('Server error');
    }
  }