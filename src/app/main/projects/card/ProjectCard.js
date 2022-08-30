import { deleteProject } from "src/app/services/ProjectService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MDBBtn } from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BuildIcon from "@mui/icons-material/Build";

const MySwal = withReactContent(Swal);

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    const onDeleteProject = async (id) => {
        MySwal.fire({
            title: <p>¿Estás seguro de que quieres eliminar este proyecto?</p>,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if(result.isConfirmed) {
                await deleteProject(id);
                toast("Proyecto eliminado", {
                    type: "error",
                    autoClose: 2000,
                });
            }
        });
    };

    return (
        <div
            className="card mb-3"
            key={project.id}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <Typography variant="h6">
                        {project.name}
                    </Typography>
                    <div>
                        <IconButton aria-label="build" color="primary"
                            onClick={() => navigate(`/proyectos/${project.id}/detalle`)}>
                            <BuildIcon />
                        </IconButton>
                        <IconButton aria-label="edit" color="warning" 
                            onClick={() => navigate(`/proyectos/${project.id}/editar`)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error" onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
                <Typography variant="body1">{project.description}</Typography>
            </div>
        </div>
    );
}

export default ProjectCard