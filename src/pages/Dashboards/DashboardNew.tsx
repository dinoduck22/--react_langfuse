import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import FormPageLayout from '../../components/Layouts/FormPageLayout';
import FormGroup from '../../components/Form/FormGroup';

const DashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // 실제 앱에서는 이 데이터를 API로 전송합니다.
    console.log({ name, description });
    alert(`Dashboard "${name}" saved! Check the console for details.`);
    navigate('/dashboards'); // 저장 후 목록 페이지로 이동
  };

  const handleCancel = () => {
    navigate('/dashboards');
  };

  const breadcrumbs = (
    <>
      <LayoutDashboard size={16} />
      <Link to="/dashboards">Dashboards</Link>
      <span>/</span>
      <span className="active">New dashboard</span>
    </>
  );

  return (
    <FormPageLayout
      breadcrumbs={breadcrumbs}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaveDisabled={!name.trim()} // 이름이 비어있으면 저장 버튼 비활성화
    >
      <FormGroup
        htmlFor="dashboard-name"
        label="Name"
        subLabel="Unique identifier for this dashboard."
      >
        <input
          id="dashboard-name"
          type="text"
          className="form-input" // 공통 스타일 클래스 사용
          placeholder="e.g. daily-token-usage"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>

      <FormGroup
        htmlFor="dashboard-description"
        label="Description"
        subLabel="Optional description."
      >
        <textarea
          id="dashboard-description"
          className="form-textarea" // 공통 스타일 클래스 사용
          placeholder="Describe the purpose of this dashboard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
    </FormPageLayout>
  );
};

export default DashboardNew;