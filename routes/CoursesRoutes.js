const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const AccessMiddleware = require('../middlewares/accessMiddleware');
const upload = require('../utils/upload');
const Course = require('../models/Course');

// GET all courses
router.get('/', courseController.getAllCourses);

// GET all courses
router.get('/get_by_employer',
  AuthMiddleware,
  AccessMiddleware,
  courseController.getAllCoursesByIdx,
);

// POST create course
// router.post('/', upload.single('logo'), courseController.createCourse);

router.post('/', upload.single('logo'), async (req, res) => {
    try {
      const { course_name, degree_type, interest, institution, language, delivery, location, duration, cost, link, target, employerId, about, overview, application_deadline, start_dates, tuition_and_fees } = req.body;
        const logo = req.file ? `${req.protocol}://${req.get('host')}/files/${req.file.filename}` : ''; // Uploaded file path
        const newCourse = new Course({
            course_name,
            degree_type,
            interest,
            institution,
            language,
            delivery,
            location,
            duration,
            cost,
            link,
            target,
            logo,
            employerId,
            about,
            overview,
            application_deadline,
            start_dates,
            tuition_and_fees
        });  
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT edit course
router.put('/:id', upload.single('logo'), async (req, res) => {
    try {
        const { course_name, degree_type, interest, institution, language, delivery, location, duration, cost, link, target, employerId, about, overview, application_deadline, start_dates, tuition_and_fees } = req.body;
        const logo = req.file ? `${req.protocol}://${req.get('host')}/files/${req.file.filename}` : '';
        const id = req.params.id;        
        let newCourse = {course_name,
            degree_type: degree_type,
            interest: interest,
            institution: institution,
            language: language,
            delivery: delivery,
            location: location,
            duration: duration,
            cost: cost,
            link: link,
            target: target,
            employerId: employerId,
            about: about,
            overview: overview,
            application_deadline: application_deadline,
            start_date: start_dates,
            tuition_and_fees: tuition_and_fees
        };
        if (logo != '') {                
            newCourse = {
                degree_type: degree_type,
                interest: interest,
                institution: institution,
                language: language,
                delivery: delivery,
                location: location,
                duration: duration,
                cost: cost,
                logo: logo,
                employerId: employerId,
                link: link,
                target: target,
                about: about,
                overview: overview,
                application_deadline: application_deadline,
                start_date: start_dates,
                tuition_and_fees: tuition_and_fees
            };
        }      
      const savedCourse = await Course.findByIdAndUpdate(id, newCourse, { new: true });
      res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET course by id
router.get('/:id', courseController.getCourseById);

// DELETE course by id
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
