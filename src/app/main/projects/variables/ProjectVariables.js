import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MDBInput, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBBadge, MDBModal, MDBModalContent, MDBModalDialog, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBModalTitle } from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select'
import { getVariables, getVariablesByCareerId } from "src/app/services/VariableService";
import { createProjectVariable, deleteProjectVariable, getCurrentProjectVariables, getProjectVariables, updateProjectVariable } from "src/app/services/ProjectVariableService";;
import { getProject } from "src/app/services/ProjectService";
import { styled } from '@mui/material/styles';
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Button, FormLabel, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Root from "../../Root";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

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

const initialState = {
    id: "",
    pronoun: "",
    variable: "",
};

ReactModal.setAppElement('#root');
const MySwal = withReactContent(Swal);

const ProjectVariables = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [project, setProject] = useState();
    const [variables, setVariables] = useState([]);
    const [projectVariables, setProjectVariables] = useState([]);

    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const projectVariable = watch();

    const getProjectById = async (projectId) => {
        const doc = await getProject(projectId);
        setProject({ ...doc.data() });
        return doc.data();
    };

    const getAllVariables = async (careerId) => {
        const querySnapshot = await getVariablesByCareerId(careerId);
        const docs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docs.push({ label: data.value, value: doc.id });
        })
        setVariables(docs);
    };

    const getAllProjectVariables = async (projectId) => {
        const querySnapshot = await getCurrentProjectVariables(projectId);
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        setProjectVariables(docs);
    }

    const saveProjectVariable = async (data, e) => {
        if (!data.id) {
            await createProjectVariable({
                pronoun: data.pronoun,
                variable: data.variable,
                project_id: params.id,
                project_version_id: ""
            });
        } else {
            console.log(data);
            await updateProjectVariable(data.id, { pronoun: data.pronoun, variable: data.variable });
        }
        toggleModal();
        reset(initialState);
        await getAllProjectVariables(params.id);
        dispatch(
            showMessage({
                message: 'Cambios guardados',
                variant: 'success'
            })
        );
    }

    const onEditProjectVariable = (projectVariable) => {
        reset(projectVariable);
        toggleModal();
    }

    const onConfirmDeleteProjectVariable = async (projectVariableId) => {
        MySwal.fire({
            title: <p>¿Está Seguro?</p>,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteProjectVariable(projectVariableId);;
                dispatch(
                    showMessage({
                        message: 'Cambios guardados',
                        variant: 'success'
                    })
                );
                await getAllProjectVariables(params.id);
            }
        });
    };

    const getVariableLabel = (variableId) => {
        const variable = variables.find(x => x.value === variableId);
        return variable ? variable.label : "---";
    }

    useEffect(() => {
        getProjectById(params.id).then((value) => {
            getAllVariables(value.career_id);
            getAllProjectVariables(params.id);
        });
    }, []);

    const toggleModal = () => {
        setIsOpen(!modalIsOpen);
    }

    const optPronouns = [
        { value: 'la', label: 'la' },
        { value: 'el', label: 'el' },
        { value: 'las', label: 'las' },
        { value: 'los', label: 'los' }
    ];

    return (
        <>
            <Modal
                keepMounted
                open={modalIsOpen}
                onClose={toggleModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={modalStyles}>
                    <form onSubmit={handleSubmit(saveProjectVariable)}>
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            {projectVariable.id ? "Editar" : "Nueva"} Variable de Proyecto
                        </Typography>
                        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>

                            <div className="form-outline mb-4">
                                <FormLabel>Pronombre</FormLabel>
                                <Controller
                                    control={control}
                                    name="pronoun"
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <Select className="font-medium text-14" options={optPronouns} ref={ref} onChange={val => onChange(val.value)} value={optPronouns.find(c => c.value === value)} />
                                    )}
                                />
                            </div>
                            <div className="form-outline mb-4">
                                <FormLabel>Variable</FormLabel>
                                <Controller
                                    control={control}
                                    name="variable"
                                    render={({ field: { onChange, onBlur, value, ref } }) => (
                                        <Select className="font-medium text-14" options={variables} ref={ref} onChange={val => onChange(val.value)} value={variables.find(c => c.value === value)} />
                                    )}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="contained" color="primary" onClick={saveProjectVariable}>
                                    <SaveIcon />&emsp;Guardar
                                </Button>
                            </div>
                        </Typography>
                    </form>
                </Box>
            </Modal>

            <Root
                header={
                    <div className="p-24 d-flex align-items-center justify-content-between">
                        <Typography variant="h3">Variables del Proyecto</Typography>
                        <div>
                            <Button variant="contained" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                <ArrowBackIcon />&emsp;Regresar
                            </Button>
                            <Button variant="contained" color="primary" onClick={toggleModal}>
                                <AddIcon />&emsp;Nuevo
                            </Button>
                        </div>
                    </div>
                }
                content={
                    <div className="p-24 w-100">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Pronombre</TableCell>
                                        <TableCell>Variable</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projectVariables.map((projectVariable, index) => (
                                        <TableRow>
                                            <TableCell>{projectVariable.pronoun}</TableCell>
                                            <TableCell>{getVariableLabel(projectVariable.variable)}</TableCell>
                                            <TableCell>
                                                <IconButton color="warning" onClick={() => onEditProjectVariable(projectVariable)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => onConfirmDeleteProjectVariable(projectVariable.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
            />
        </>
    );
}

export default ProjectVariables