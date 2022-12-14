import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from "mdb-react-ui-kit";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { styled } from '@mui/material/styles';
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import DownloadIcon from "@mui/icons-material/Download"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import DescriptionIcon from "@mui/icons-material/Description"
import Root from "../../Root";
import { getProject } from "src/app/services/ProjectService";
import { useEffect } from "react";
import { buildProject } from "src/app/helpers/ProjectBuilder";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

ReactModal.setAppElement('#root');

const initialState = {
    name: "",
    career_id: "",
    study_center_id: "",
    user_id: "",
    description: "",
    objectives: 4,
};

const ProjectDetail = () => {
    const navigate = useNavigate();
    const params = useParams();

    const [project, setProject] = useState(initialState);

    const [problemModalIsOpen, setProblemModalIsOpen] = useState(false);
    const [hypothesisModalIsOpen, setHypothesisModalIsOpen] = useState(false);
    const [objectiveModalIsOpen, setObjectiveModalIsOpen] = useState(false);
    const [areaModalIsOpen, setAreaModalIsOpen] = useState(false);
    const [justificationModalIsOpen, setJustificationModalIsOpen] = useState(false);

    const getProjectById = async (projectId) => {
        const doc = await getProject(projectId);
        setProject({ ...doc.data() });
        console.log(doc.data());
        return doc.data();
    };

    const buildAndDownloadProject = async () => {
        const prod_url = "https://thesis-creator-api.azurewebsites.net/Home/Document?test=true";
        const local_url = "https://localhost:7020/Home/Document";
        const local_url2 = "https://localhost:7020/Home/DocumentTest";

        const model = await buildProject(params.id);
        console.log(model);

        let formBody = new FormData();
        for(var i=0; i<model.length; ++i) {
            formBody.append(`Parts[${i}].Key`, model[i].Key);
            formBody.append(`Parts[${i}].Value`, model[i].Value);
            formBody.append(`Parts[${i}].IsGeneral`, model[i].IsGeneral);
            formBody.append(`Parts[${i}].Order`, model[i].Order);
            formBody.append(`Parts[${i}].Category`, model[i].Category);
        }
        
        fetch(local_url2, {
            method: "POST",
            body: formBody,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(data => console.log(data));

        fetch(local_url, {
            method: "POST",
            body: formBody,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(data => console.log(data));

        // fetch(local_url, {
        //         method: "POST",
        //         mode: "no-cors",
        //         body: JSON.stringify(testmodel),
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Access-Control-Allow-Origin": "*"
        //         }
        //     })
        //     .then(response => response.json())
        //     .then(data => console.log(data));
    };

    const toggleProblemModal = () => {
        setProblemModalIsOpen(!problemModalIsOpen);
    }

    const toggleHypothesisModal = () => {
        setHypothesisModalIsOpen(!hypothesisModalIsOpen);
    }

    const toggleObjectiveModal = () => {
        setObjectiveModalIsOpen(!objectiveModalIsOpen);
    }

    const toggleAreaModal = () => {
        setAreaModalIsOpen(!areaModalIsOpen);
    }

    const toggleJustificationModal = () => {
        setJustificationModalIsOpen(!justificationModalIsOpen);
    }

    useEffect(() => {
        getProjectById(params.id);
    }, []);

    return (
        <>
            <Modal
                keepMounted
                open={problemModalIsOpen}
                onClose={toggleProblemModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Problema
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <div className="d-flex flex-column justify-content-center">
                            <Button variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/problema?general=true`)}>Problema General</Button>
                            {[...Array(parseInt(project.objectives) || 4)].map((x, i) =>
                                <Button className="mt-2" variant="outlined" color="secondary" onClick={() => navigate(`/proyectos/${params.id}/problema?general=false&orden=${i + 1}`)}>Problema Espec??fico {i + 1}</Button>
                            )}
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                keepMounted
                open={hypothesisModalIsOpen}
                onClose={toggleHypothesisModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Hip??tesis
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <div className="d-flex flex-column justify-content-center">
                            <Button variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/hipotesis?general=true`)}>Hip??tesis General</Button>
                            {[...Array(parseInt(project.objectives) || 4)].map((x, i) =>
                                <Button className="mt-2" variant="outlined" color="secondary" onClick={() => navigate(`/proyectos/${params.id}/hipotesis?general=false&orden=${i + 1}`)}>Hip??tesis Espec??fico {i + 1}</Button>
                            )}
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                keepMounted
                open={objectiveModalIsOpen}
                onClose={toggleObjectiveModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Objetivo
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <div className="d-flex flex-column justify-content-center">
                            <Button variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/objetivos?general=true`)}>Objetivo General</Button>
                            {[...Array(parseInt(project.objectives) || 4)].map((x, i) =>
                                <Button className="mt-2" variant="outlined" color="secondary" onClick={() => navigate(`/proyectos/${params.id}/objetivos?general=false&orden=${i + 1}`)}>Objetivo Espec??fico {i + 1}</Button>
                            )}
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                keepMounted
                open={areaModalIsOpen}
                onClose={toggleAreaModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        ??reas y Actividades
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <div className="d-flex flex-column justify-content-center">
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=1`)}>??rea estrat??gica de desarrollo prioritario</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=2`)}>Actividad econ??mica en la que se aplicar??a la investigaci??n</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=3`)}>Alcance de la soluci??n</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                keepMounted
                open={justificationModalIsOpen}
                onClose={toggleJustificationModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Justificaci??n de la Investigaci??n
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <div className="d-flex flex-column justify-content-center">
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=5`)}>Justificaci??n Te??rica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=6`)}>Justificaci??n Metodol??gica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=7`)}>Justificaci??n Pr??ctica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=8`)}>Justificaci??n Acad??mica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=9`)}>Justificaci??n por Conveniencia</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=10`)}>Justificaci??n Econ??mica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=11`)}>Justificaci??n T??cnica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=12`)}>Justificaci??n Tecnol??gica</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=13`)}>Justificaci??n Doctrinaria</Button>
                            <Button className="mt-2" variant="outlined" color="primary" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=14`)}>Justificaci??n Pedag??gica</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>

            <Root
                header={
                    <>
                        <div className="p-24">
                            <Typography variant="h3">Construir Proyecto</Typography>
                        </div>
                        <div className="p-24 d-flex justify-content-between">
                            <Button variant="contained" onClick={() => navigate("/")}>
                                <ArrowBackIcon />&emsp;Regresar
                            </Button>
                            <div>
                                <Button variant="contained" color="primary" onClick={() => navigate(`/proyectos/${params.id}/versiones`)}>
                                    <FolderOpenIcon />&emsp;Versiones
                                </Button>
                                <Button variant="contained" color="warning" onClick={() => navigate(`/proyectos/${params.id}/previsualizacion`)}>
                                    <DescriptionIcon />&emsp;Preview
                                </Button>
                                <Button variant="contained" color="error" onClick={buildAndDownloadProject}>
                                    <DownloadIcon />&emsp;Descargar
                                </Button>
                            </div>
                        </div>
                    </>
                }
                content={
                    <div className="p-24">
                        <div className="row">
                            <div className="col-md-12 card mb-3" onClick={() => navigate(`/proyectos/${params.id}/variables`)}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-cog"></i>&emsp;
                                            <Typography variant="h5">Variables</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3" onClick={() => navigate(`/proyectos/${params.id}/titulo`)}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-lightbulb"></i>&emsp;
                                            <Typography variant="h5">T??tulo</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3" onClick={toggleAreaModal}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-align-justify"></i>&emsp;
                                            <Typography variant="h5">??reas y Actividades</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3" onClick={() => navigate(`/proyectos/${params.id}/contenido?categoria=4`)}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-align-justify"></i>&emsp;
                                            <Typography variant="h5">Planteamiento del Problema</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between" onClick={toggleProblemModal}>
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-chart-line"></i>&emsp;
                                            <Typography variant="h5">Problema</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between" onClick={toggleHypothesisModal}>
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-question"></i>&emsp;
                                            <Typography variant="h5">Hip??tesis</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between" onClick={toggleObjectiveModal}>
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-bullseye"></i>&emsp;
                                            <Typography variant="h5">Objetivos</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3" onClick={toggleJustificationModal}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-align-justify"></i>&emsp;
                                            <Typography variant="h5">Justificaci??n de la Investigaci??n</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <i class="fas fa-3x fa-book"></i>&emsp;
                                            <Typography variant="h5">Referencias</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                }
            />
        </>

    );
}

export default ProjectDetail