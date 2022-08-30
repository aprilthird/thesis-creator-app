
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MDBBtn } from "mdb-react-ui-kit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import DownloadIcon from "@mui/icons-material/Download"
import Root from "../../Root";
import { Button, Typography } from "@mui/material";

const ProjectPreview = ({ project }) => {
    const navigate = useNavigate();
    const params = useParams();

    const previewStyle = {
        width: "100%",
        height: "600px"
    };

    return (
        <Root
            header={
                <div className="p-24 d-flex align-items-center justify-content-between">
                        <Typography variant="h3">Previsualización de Proyecto</Typography>
                        <div>
                            <Button variant="contained" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                <ArrowBackIcon />&emsp;Regresar
                            </Button>
                            <Button variant="contained" color="error" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                <DownloadIcon />&emsp;Descargar
                            </Button>
                        </div>
                    </div>
            }
            content={
                <div className="p-24 w-100">
                    <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc" style={previewStyle}></iframe>
                </div>
            }
        />
    );
}

export default ProjectPreview