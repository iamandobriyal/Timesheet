'use strict';
const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.post('/avatar', passport.authenticate('jwt', { session: false }), userCtrl.avatar_upload);

router.post('/updatePassword', passport.authenticate('jwt', { session: false }), userCtrl.updatePassword);
router.route('/').post(asyncHandler(insert));

async function insert(req, res) {
  return await userCtrl.insert(req, res, "");
}