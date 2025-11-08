import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function PurchaseOrder() {
  const translate = useLanguage();
  const entity = 'purchaseorder';

  const searchConfig = {
    displayLabels: ['poNumber', 'supplier.companyName'],
    searchFields: 'poNumber,supplier.companyName',
  };

  const deleteModalLabels = ['poNumber'];

  const entityDisplayLabels = ['poNumber'];

  const Labels = {
    PANEL_TITLE: translate('purchase_order'),
    DATATABLE_TITLE: translate('purchase_order_list'),
    ADD_NEW_ENTITY: translate('add_new_purchase_order'),
    ENTITY_NAME: translate('purchase_order'),
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
