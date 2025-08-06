const Idea = require('../models/Idea');

exports.getAllIdeas = async (req, res) => {
    console.log("Retrieving all ideas");
    try {
        const ideas = await Idea.find();
        res.status(200).json(ideas); // Empty array is okay
    } catch (error) {
        console.error('Error fetching all ideas:', error);
        res.status(500).json({ message: 'Server error fetching ideas' });
    }
};

exports.deleteIdea = async (req, res) => {
    const ideaId = req.params.ideaId;
    console.log("Deleteing idea with id: ", ideaId);

    try {
        const idea = await Idea.findOne({ id: ideaId });

        if(!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        console.log("Idea found: ", idea)
        await Idea.findByIdAndDelete(idea._id);

        const io = req.app.locals.io;
        io.emit('idea-deleted', idea.id);


        res.status(200).json({ message: 'Idea deleted' });

    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ message: 'Server error deleting idea' });
      }
}



exports.upVoteIdea = async (req, res) => {
    const ideaId = req.params.ideaId;
    console.log("Upvoting idea with id: ", ideaId);

    try {
        const idea = await Idea.findOne({ id: ideaId });

        console.log("Idea found: ", idea)

        if(!idea) return res.status(404).send('Idea not found');

        idea.votes += 1;
        await idea.save();

        const io = req.app.locals.io;
        io.emit('idea-voted', { ideaId: idea.id, votes: idea.votes });

        res.status(200).json({ message: 'Idea upvoted', votes: idea.votes });
    }
    catch(error) {
        console.error('Upvote failed:', error);
        res.status(500).json({ message: 'Server error while upvoting idea' });
    }
}

exports.downVoteIdea = async (req, res) => {
    const ideaId = req.params.ideaId;
    console.log("Upvoting idea with id: ", ideaId);

    try {
        const idea = await Idea.findOne({ id: ideaId });

        console.log("Idea found: ", idea)

        if(!idea) return res.status(404).send('Idea not found');

        idea.votes -= 1;
        await idea.save();

        const io = req.app.locals.io;
        io.emit('idea-voted', { ideaId: idea.id, votes: idea.votes });

        res.status(200).json({ message: 'Idea downvoted', votes: idea.votes });
    }
    catch(error) {
        console.error('Downvote failed:', error);
        res.status(500).json({ message: 'Server error while downvoting idea' });
    }
}

exports.editIdeaContent = async (req, res) => {
    const ideaId = req.params.ideaId;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'content is required' });
    }

    try {
        const updatedIdea = await Idea.findOneAndUpdate(
        { id: ideaId },
        { content: content },
        { new: true }
        );

        if (!updatedIdea) {
        return res.status(404).json({ message: 'Idea not found' });
        }

        const io = req.app.locals.io;
        io.emit('idea-updated', updatedIdea);

        res.status(200).json(updatedIdea);
    } catch (error) {
        console.error('Error updating idea content:', error);
        res.status(500).json({ message: 'Server error updating content' });
    }
};

exports.completeActionItem = async (req, res) => {
    const ideaId = req.params.ideaId;
    
    try {
        const updatedIdea = await Idea.findOneAndUpdate(
            { id: ideaId },
            { completed: true },
        );

        if (!updatedIdea) {
        return res.status(404).json({ message: 'Idea not found' });
        }

        res.json(updatedIdea);
    } catch (err) {
        res.status(500).json({ message: 'Error updating idea', error: err });
    }
}