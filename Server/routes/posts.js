const express = require("express");

const Posts = require("../model/InstaPostShema");
const User = require("../model/UserShema");
const router = express.Router();
const mongoose = require("mongoose");
const Authenticate = require("../middleware/Authenticate");
router.get("/getPosts", Authenticate, async(req, res) => {
    const getUsersPosts = await Posts.find();

    res.json({ Data: getUsersPosts });
});

router.get("/getPostsUserWise", Authenticate, async(req, res) => {
    const getUsersWisePosts = await Posts.find({
        postedbyId: req.user.id,
    });

    res.json({ Data: getUsersWisePosts });
});
router.put("/postsLikes", Authenticate, async(req, res) => {
    try {
        const result = await Posts.findByIdAndUpdate(
            req.body.postId, {
                $push: { likes: req.user.id },
            }, {
                new: true,
            }
        );
        res.json({ result });
    } catch (error) {
        console.log(error);
    }
});
router.put("/postsDisLikes", Authenticate, async(req, res) => {
    try {
        const result = await Posts.findByIdAndUpdate(
            req.body.postId, {
                $pull: { likes: req.user.id },
            }, {
                new: true,
            }
        );
        res.json({ result });
    } catch (error) {
        console.log(error);
    }
});

router.delete("/deletePost/:postId", Authenticate, async(req, res) => {
    try {
        const result = await Posts.findOne({ _id: req.params.postId });

        if (result.postedbyId === req.user.id) {
            result.remove();
            res.json({ result });
        }
    } catch (error) {}
});

router.put("/postsComents", Authenticate, async(req, res) => {
    const comments_data = {
        comments: req.body.comments,
        postedby: req.user.name,
        postedbyId: req.user.id,
    };
    try {
        const result = await Posts.findByIdAndUpdate(
            req.body.postId, {
                $push: { comments: comments_data },
            }, {
                new: true,
            }
        );
        res.json({ result });
    } catch (error) {
        console.log(error);
    }
});

router.post("/createPosts", Authenticate, async(req, res) => {
    try {
        const { title, body, photo } = req.body;
        if (!title || !body) {
            res.json({ error: "Fill All The Fields" });
        } else {
            console.log(req.user.name);
            const InstaPost = await Posts({
                title,
                body,
                photo: photo,
                postedby: req.user.name,
                postedbyId: req.user.id,
            });
            const data = await InstaPost.save();
            if (data) {
                res.json({ Message: "Post Created Successfully" });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

router.get("/userprofile/:id", Authenticate, async(req, res) => {
    try {
        const userdata = await User.findOne({ _id: req.params.id });

        console.log(userdata);
        if (userdata) {
            const PostOfUser = await Posts.find({ postedbyId: req.params.id });

            console.log(PostOfUser);

            res.json({ userdata, PostOfUser });
        }
    } catch (error) {
        console.log(error);
    }
});

router.put("/follow", Authenticate, (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId, {
            $push: { followers: req.user.id },
        }, { new: true },
        (err, result) => {
            if (err) {
                res.json({ error: err });
            }
            ``;
            User.findByIdAndUpdate(
                req.user.id, {
                    $push: { following: req.body.followId },
                }, { new: true }
            )

            .then((result) => {
                    console.log(result);
                    res.json({ result });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    );
});

router.put("/unfollow", Authenticate, (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId, {
            $pull: { followers: req.user.id },
        }, { new: true },
        (err, result) => {
            if (err) {
                res.json({ error: err });
            }

            User.findByIdAndUpdate(
                    req.user.id, {
                        $pull: { following: req.body.unfollowId },
                    }, { new: true }
                )
                .then((res) => {
                    res.json();
                })
                .then((result) => console.log(result))
                .catch((error) => {
                    console.log(error);
                });
        }
    );
});

// router.put("/commentsLikes", Authenticate, async(req, res) => {
//     const comments_data = {
//         comments_likes: req.user.id,
//     };
//     try {
//         const result = await Posts.findByIdAndUpdate(
//             req.body.PostId, {
//                 $push: { comments: comments_data },
//             }, {
//                 new: true,
//             }
//         );
//         console.log(req.body.commentsId);
//         console.log(result);
//         res.json({ result });
//     } catch (error) {
//         console.log(error);
//     }
// });

module.exports = router;