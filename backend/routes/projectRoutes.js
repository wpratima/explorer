const express = require('express')
const Project = require('../models/project')
const app = express()


//read projects
app.get('/projects', async (req, res) =>{
    const projects = await Project.find({});
    try{
        res.status(200).send({
            count: projects.length,
            data: projects
        })
    } catch (e){
        res.status(500).send(e)
    }
})

//create project
app.post('/project', async (req, res) => {
    
    try{
        const project = await Project.create(req.body)
        res.status(200).send({
            message: 'Project creation successful',
            data: project
        })
    } catch (e){
        res.status(500).send(e)
    }
})

//get a project by id
app.get('/project/:id', async (req, res) => {
    
    try{
        const project =  await Project.findById(req.params.id)
        res.status(200).send({
            data: project,
        })
    } catch (e){
        res.status(500).send(e)
    }
})

//update project
app.patch('/project/:id', async (req, res) => {
    
    try{
        await Project.findByIdAndUpdate(req.params.id, req.body)
        const project = await Project.save()
        res.status(200).send({
            message: 'Project updated successfully',
            data: project
        })
    } catch (e){
        res.status(500).send(e)
    }
})

//delete project
app.delete('/project/:id', async (req, res) => {
    
    try{
        const project =  await Project.findByIdAndDelete(req.params.id)
        res.status(200).send({
            message: 'Project deleted successfully',
        })
    } catch (e){
        res.status(500).send(e)
    }
})

module.exports = app;