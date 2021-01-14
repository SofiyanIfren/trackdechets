import { RedErrorMessage } from "common/components";
import NumberInput from "form/custom-inputs/NumberInput";
import { RadioButton } from "form/custom-inputs/RadioButton";
import { Field, useFormikContext } from "formik";
import React, { useEffect } from "react";
import Tooltip from "../common/components/Tooltip";
import TagsInput from "./tags-input/TagsInput";

import "./WasteInfo.scss";

export default function WasteInfo({ disabled }) {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    setFieldValue("quantity.number", values.identification.numbers.length);
  }, [setFieldValue, values.identification.numbers]);

  return (
    <>
      {disabled && (
        <div className="notification notification--error">
          Les champs ci-dessous ont été scéllés via signature et ne sont plus
          modifiables.
        </div>
      )}
      <div className="form__row">
        <fieldset>
          <legend>
            Code déchet{" "}
            <Tooltip msg="Peut exceptionnellement être un déchet dangereux. Le déchet pourra alors uniquement être envoyé à un autre centre VHU." />
          </legend>
          <Field
            disabled={disabled}
            name="wasteCode"
            id="16 01 06"
            label="16 01 06 - véhicules hors d'usage ne contenant ni liquides ni autres composants dangereux"
            component={RadioButton}
          />
          <Field
            disabled={disabled}
            name="wasteCode"
            id="16 01 04*"
            label="16 01 04* - véhicules hors d’usage non dépollué par un centre agréé"
            component={RadioButton}
          />
        </fieldset>

        <RedErrorMessage name="wasteCode" />
      </div>

      <h4 className="form__section-heading">Description des VHUs</h4>

      <div className="form__row">
        <fieldset>
          <legend>Conditionnement</legend>
          <Field
            disabled={disabled}
            name="packaging"
            id="UNITE"
            label="en unités"
            component={RadioButton}
          />
          <Field
            disabled={disabled}
            name="packaging"
            id="LOT"
            label="en lots"
            component={RadioButton}
          />
        </fieldset>

        <RedErrorMessage name="packaging" />
      </div>

      <div className="form__row">
        <fieldset>
          <legend>Identification par N° d'ordre</legend>
          <Field
            disabled={disabled}
            name="identification.type"
            id="NUMERO_ORDRE_REGISTRE_POLICE"
            label="tels qu'ils figurent dans le registre de police"
            component={RadioButton}
          />
          <Field
            disabled={disabled}
            name="identification.type"
            id="NUMERO_ORDRE_LOTS_SORTANTS"
            label="des lots sortants"
            component={RadioButton}
          />
        </fieldset>

        <RedErrorMessage name="identification.type" />
      </div>

      <div className="form__row">
        <label>
          Détail des identifications
          <Tooltip msg="Saisissez les identifications une par une. Appuyez sur la touche <Entrée> pour valider chacune" />
          <TagsInput
            name="identification.numbers"
            onChange={val => console.log(val)}
            disabled={disabled}
          />
        </label>
      </div>

      <h4 className="form__section-heading">Quantité</h4>

      <div className="tw-flex tw-space-x-8">
        <div className="form__row">
          <label>
            En nombre
            <Field
              component={NumberInput}
              name="quantity.number"
              className="td-input waste-details__quantity"
              disabled
            />
          </label>

          <RedErrorMessage name="quantity.number" />
        </div>

        <div className="form__row">
          <label>
            En tonnes (le cas échéant)
            <Field
              disabled={disabled}
              component={NumberInput}
              name="quantity.tons"
              className="td-input waste-details__quantity"
              placeholder="2"
              min="0"
              step="1"
            />
          </label>

          <RedErrorMessage name="quantity.tons" />
        </div>
      </div>
    </>
  );
}
