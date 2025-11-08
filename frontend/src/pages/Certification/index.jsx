import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Certification() {
  const translate = useLanguage();
  const entity = 'certification';

  const searchConfig = {
    displayLabels: ['certificationNumber', 'certificationName'],
    searchFields: 'certificationNumber,certificationName,certificationType',
  };

  const deleteModalLabels = ['certificationName', 'certificationNumber'];

  const entityDisplayLabels = ['certificationNumber'];

  const Labels = {
    PANEL_TITLE: translate('certification'),
    DATATABLE_TITLE: translate('certification_list'),
    ADD_NEW_ENTITY: translate('add_new_certification'),
    ENTITY_NAME: translate('certification'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    entityDisplayLabels,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
