import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DemoContent from '@fuse/core/DemoContent';
import { useNavigate } from 'react-router-dom';
import { getProjects } from 'src/app/services/ProjectService';
import { useEffect, useState } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function ExamplePage(props) {
  const { t } = useTranslation('examplePage');

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
        <div className="p-24">
          <h4>{t('TITLE')}</h4>
        </div>
      }
      content={
        <div className="p-24">
          {/* <h4>Content</h4> */}
          {/* <br /> */}
          {/* <DemoContent /> */}
          <div className="d-flex justify-content-between">
            <h1>Listado de Proyectos</h1>
            <div className="d-flex align-items-center">
              <MDBBtn color="primary" onClick={() => navigate("/crear")}>
                <i className='fas fa-plus'></i>&emsp;Nuevo
              </MDBBtn>
            </div>
          </div>
          <div className="row">
            {projects.map((project) => (
              <div className="col-md-4" key={project.id}>
                <div
                  className="card mb-3"
                  key={project.id}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4>{project.name}</h4>
                      <div>
                        <MDBBtn className="me-1" color="primary"
                        >
                          <i className="fas fa-bars"></i>
                        </MDBBtn>
                        <MDBBtn className="me-1" color="info"
                        >
                          <i className="fas fa-edit"></i>
                        </MDBBtn>
                        <MDBBtn color="danger"
                          onClick={(e) => {
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </MDBBtn>
                      </div>
                    </div>
                    <p>{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      scroll="content"
    />
  );
}

export default ExamplePage;
