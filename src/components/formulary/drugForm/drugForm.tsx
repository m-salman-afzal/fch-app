import { FC, useEffect, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Modal,
  Radio,
  Row,
  Switch,
  Typography
} from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  FORMULARY_PACKAGES,
  FORMULARY_RELEASES,
  FORMULATIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useFormularyStyle } from '../useFormularyStyle';

const { useBreakpoint } = Grid;

interface Props {
  title?: string;
  handleDrugFormSubmit: (val: any) => void;
  drugFormRef: FormInstance;
  setOpen: (val: boolean) => void;
  open: boolean;
  facilityExists: any[];
  drugToEdit: any;
  isLoading: boolean;
  showDrugTypeOption: boolean;
  controlled: boolean;
}

export const DrugFormModal: FC<Props> = ({
  title,
  setOpen,
  open,
  handleDrugFormSubmit,
  drugFormRef,
  drugToEdit,
  isLoading,
  showDrugTypeOption,
  controlled
}) => {
  const size = useBreakpoint();
  const { drugNameRadioGroup, switchContainer } = useFormularyStyle();
  const [selectedDrugName, setSelectedDrugName] = useState<string>('GENERIC');
  const [isControlled, setIsControlled] = useState<boolean>(false);
  const [isFormulary, setIsFormulary] = useState<boolean>(false);
  const [isGeneric, setIsGeneric] = useState<boolean>(false);
  const onSubmitForm = (data: any) => {
    handleDrugFormSubmit({
      ...data,
      isControlled,
      isGeneric,
      isFormulary
    });
  };

  useEffect(() => {
    setIsControlled(controlled);
  }, []);
  useEffect(() => {
    if (drugToEdit) {
      setSelectedDrugName(drugToEdit?.drugName);
      setIsControlled(!!drugToEdit?.isControlled);
      setIsGeneric(!!drugToEdit?.isGeneric);
      setIsFormulary(!drugToEdit?.isFormulary);
    } else {
      setSelectedDrugName('GENERIC');
      setIsControlled(controlled);
      setIsGeneric(false);
      setIsFormulary(false);
    }
  }, [drugToEdit]);

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      title={
        <div style={{ paddingLeft: 20, fontSize: 20, paddingTop: 12 }}>
          {title ?? 'Add Drug'}
        </div>
      }
      width={size.xs ? '100%' : pxToRem(678)}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      styles={{
        content: {
          padding: 0
        }
      }}
      onCancel={() => {
        setSelectedDrugName('GENERIC');
        setIsControlled(false);
        setIsGeneric(false);
        drugFormRef.resetFields();
        setOpen(false);
      }}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      <Form
        form={drugFormRef}
        onFinish={onSubmitForm}
        style={{
          width: '100%',
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`
        }}
        scrollToFirstError={true}
      >
        <Row
          style={{
            width: '100%',
            justifyContent: 'center',
            columnGap: pxToRem(11),
            height: size.xs ? pxToRem(500) : `100%`,
            overflow: 'auto',
            scrollBehavior: `smooth`,
            paddingTop: pxToRem(6),
            rowGap: !size.xs ? pxToRem(6) : 0
          }}
        >
          <Col
            style={{
              width: size.xs ? pxToRem(311) : '100%',
              bottom: pxToRem(10)
            }}
          >
            <Typography.Text
              style={{
                marginLeft: size.xs ? 0 : pxToRem(25),
                color: 'rgba(0, 0, 0, 0.45)',
                fontWeight: 500,
                fontSize: pxToRem(12)
              }}
            >
              DRUG NAME
            </Typography.Text>
          </Col>
          <Col style={{ width: '100%' }}>
            <VsFormItem
              formItemProps={{
                name: 'drugName',
                rules: [
                  {
                    required: true,
                    message: (
                      <ErrorMessage>
                        Choose Drug Name for The Formulary
                      </ErrorMessage>
                    )
                  }
                ],
                initialValue: selectedDrugName
              }}
            >
              <Radio.Group
                className={drugNameRadioGroup}
                buttonStyle={`solid`}
                name="drugName"
                value={selectedDrugName}
                onChange={(e: any) => {
                  setSelectedDrugName(e?.target?.value);
                  drugFormRef.validateFields();
                }}
              >
                <Radio
                  value={`BRAND`}
                  className={
                    selectedDrugName === 'BRAND' ? 'selectedRadioButton' : ''
                  }
                >
                  Brand
                  <span className="radioButtonSubtitle">
                    Use the brand drug name in the formulary
                  </span>
                </Radio>
                <Radio
                  value={`GENERIC`}
                  className={
                    selectedDrugName === 'GENERIC' ? 'selectedRadioButton' : ''
                  }
                >
                  Generic
                  <span className="radioButtonSubtitle">
                    Use the generic drug name in the formulary
                  </span>
                </Radio>
              </Radio.Group>
            </VsFormItem>
          </Col>
          <Col
            style={{
              width: size.xs ? pxToRem(311) : '100%',
              bottom: pxToRem(10)
            }}
          >
            <Typography.Text
              style={{
                marginLeft: size.xs ? 0 : pxToRem(25),
                color: 'rgba(0, 0, 0, 0.45)',
                fontWeight: 500,
                fontSize: pxToRem(12)
              }}
            >
              DRUG DETAILS
            </Typography.Text>
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <BasicInputFormItem
              placeholder="Brand Name"
              formItemProps={{
                name: 'brandName',
                rules: [
                  {
                    required: selectedDrugName === 'BRAND',
                    message: <ErrorMessage>Enter Brand Name</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <BasicInputFormItem
              placeholder="Generic Name"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Generic Name</ErrorMessage>
                  }
                ],
                name: 'genericName'
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <BasicInputFormItem
              placeholder="Strength/Unit"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Strength/Unit</ErrorMessage>
                  }
                ],
                name: 'strengthUnit'
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <VsSelectFormItem
              placeholder="Formulation"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Select Formulation</ErrorMessage>
                  }
                ],
                name: 'formulation'
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              formNamePath={['formulation']}
              options={FORMULATIONS}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <VsSelectFormItem
              placeholder="Release"
              formItemProps={{
                rules: [
                  {
                    required: false,
                    message: <ErrorMessage>Select Release</ErrorMessage>
                  }
                ],
                name: 'release'
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              formNamePath={['release']}
              options={FORMULARY_RELEASES}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <VsSelectFormItem
              placeholder="Package"
              formItemProps={{
                rules: [
                  {
                    required: false,
                    message: <ErrorMessage>Select Package</ErrorMessage>
                  }
                ],
                name: 'package'
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              formNamePath={['package']}
              options={FORMULARY_PACKAGES}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <BasicInputFormItem
              placeholder="Unit/Package"
              formItemProps={{
                rules: [
                  {
                    required: false,
                    message: <ErrorMessage>Enter Unit/Package</ErrorMessage>
                  }
                ],
                name: 'unitsPkg'
              }}
              type={`number`}
              width="100%"
            />
          </Col>
          <Col style={{ width: pxToRem(311) }}>
            <BasicInputFormItem
              placeholder="Drug Class"
              formItemProps={{
                rules: [
                  {
                    required: false,
                    message: <ErrorMessage>Enter Drug Class</ErrorMessage>
                  }
                ],
                name: 'drugClass'
              }}
              width="100%"
            />
          </Col>
          {
            <Col style={{ width: size.xs ? pxToRem(311) : '100%' }}>
              <VsFormItem
                formItemProps={{
                  name: 'isControlled',
                  valuePropName: 'checked'
                }}
              >
                <Row className={switchContainer}>
                  <Col>
                    <Switch
                      disabled={!showDrugTypeOption}
                      checked={isControlled}
                      onChange={() => setIsControlled(!isControlled)}
                    />
                  </Col>
                  <Col className="switchSupportingText">
                    <Typography.Text className="switchMainTitle">
                      Controlled?
                    </Typography.Text>
                    <Typography.Text className="switchSubTitle">
                      Is this a controlled substance?
                    </Typography.Text>
                  </Col>
                </Row>
              </VsFormItem>
            </Col>
          }

          <Divider
            style={{
              margin: `${pxToRem(-10)} 0 ${pxToRem(15)} 0`,
              width: size.xs ? pxToRem(311) : '93%',
              minWidth: size.xs ? pxToRem(311) : '93%'
            }}
          />
          <Col style={{ width: size.xs ? pxToRem(311) : '100%' }}>
            <VsFormItem
              formItemProps={{
                name: 'isGeneric',
                valuePropName: 'checked'
              }}
            >
              <Row className={switchContainer}>
                <Col>
                  <Switch
                    checked={isGeneric}
                    onChange={() => setIsGeneric(!isGeneric)}
                  />
                </Col>
                <Col className="switchSupportingText">
                  <Typography.Text className="switchMainTitle">
                    Generic?
                  </Typography.Text>
                  <Typography.Text className="switchSubTitle">
                    Is this drug generic?
                  </Typography.Text>
                </Col>
              </Row>
            </VsFormItem>
          </Col>
          <Divider
            style={{
              margin: `${pxToRem(-10)} 0 ${pxToRem(15)} 0`,
              width: size.xs ? pxToRem(311) : '93%',
              minWidth: size.xs ? pxToRem(311) : '93%'
            }}
          />
          <Col style={{ width: size.xs ? pxToRem(311) : '100%' }}>
            <VsFormItem
              formItemProps={{
                name: 'isFormulary',
                valuePropName: 'checked'
              }}
            >
              <Row className={switchContainer}>
                <Col>
                  <Switch
                    checked={isFormulary}
                    onChange={() => setIsFormulary(!isFormulary)}
                  />
                </Col>
                <Col className="switchSupportingText">
                  <Typography.Text className="switchMainTitle">
                    Non-Formulary?
                  </Typography.Text>
                  <Typography.Text className="switchSubTitle">
                    Is this drug Non-Formulary?
                  </Typography.Text>
                </Col>
              </Row>
            </VsFormItem>
          </Col>
        </Row>
        <Divider style={{ marginTop: 0, marginBottom: 12 }} />
        <Row
          justify={size.xs ? `center` : `end`}
          style={{
            paddingBottom: 12,
            columnGap: pxToRem(15),
            padding: !size.xs
              ? `0 ${pxToRem(20)} ${pxToRem(12)} 0`
              : `0 0 ${pxToRem(10)} 0`,
            width: size.xs ? pxToRem(330) : '100%'
          }}
        >
          <Col style={size.xs ? { width: '45%' } : {}}>
            <VsButton
              size={BUTTON_SIZES.large}
              style={{ width: size.xs ? '100%' : pxToRem(130) }}
              onClick={() => {
                setSelectedDrugName('GENERIC');
                setIsControlled(false);
                setIsGeneric(false);
                drugFormRef.resetFields();
                setOpen(false);
              }}
            >
              Cancel
            </VsButton>
          </Col>
          <Col style={size.xs ? { width: '45%' } : {}}>
            <VsButton
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit',
                icon: !drugToEdit && <PlusOutlined />,
                loading: isLoading
              }}
              size={BUTTON_SIZES.large}
              style={{ width: size.xs ? '100%' : pxToRem(130) }}
            >
              {drugToEdit ? 'Save' : 'Add Drug'}
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
