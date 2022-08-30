import { useEffect, useState } from 'react'
import { getProjects, onGetProjects } from 'src/app/services/ProjectService'
import { useNavigate } from 'react-router-dom'
import { MDBBtn } from 'mdb-react-ui-kit'
import ProjectCard from '../card/ProjectCard'
import Root from '../../Root'
import { Button, Typography } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"

const ProjectsList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    const getAllProjects = async () => {
        const querySnapshot = await getProjects();
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        setProjects(docs);
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    return (
        <Root
            header={
                <div className="p-24 d-flex align-items-center justify-content-between">
                    <Typography variant="h3">Listado de Proyectos</Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate("/proyectos/crear")}>
                        <AddIcon />&emsp;Nuevo
                    </Button>
                </div>
            }
            content={
                <div className="p-24">
                    <div className="row">
                        {projects.map((project) => (
                            <div className="col-md-4" key={project.id}>
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </div>
            }
            scroll="content"
        />
    )
}

export default ProjectsList