import { checkIsAuthenticated } from "../../../common/permissions";
import { MutationResolvers } from "../../../generated/graphql/types";
import { getFormOrFormNotFound } from "../../database";
import { expandFormFromDb } from "../../form-converter";
import { checkCanMarkAsSent } from "../../permissions";
import { checkCanBeSealed, signingInfoSchema } from "../../validation";
import transitionForm from "../../workflow/transitionForm";
import { EventType } from "../../workflow/types";
import { getFormRepository } from "../../repository";

const markAsSentResolver: MutationResolvers["markAsSent"] = async (
  parent,
  args,
  context
) => {
  const user = checkIsAuthenticated(context);

  const { id, sentInfo } = args;

  const form = await getFormOrFormNotFound({ id });

  await checkCanMarkAsSent(user, form);

  if (form.status === "DRAFT") {
    // check it can be sealed
    await checkCanBeSealed(form);
  }

  // validate input
  await signingInfoSchema.validate(sentInfo);

  // when form is sent, we store transporterCompanySiret as currentTransporterSiret to ease multimodal management
  const formUpdateInput = {
    ...sentInfo,
    sentAt: new Date(sentInfo.sentAt),
    currentTransporterSiret: form.transporterCompanySiret,
    signedByTransporter: false
  };
  const resentForm = await transitionForm(user, form, {
    type: EventType.MarkAsSent,
    formUpdateInput
  });

  // mark appendix2Forms as GROUPED
  const appendix2Forms = await getFormRepository(user).findAppendix2FormsById(
    form.id
  );

  if (appendix2Forms.length > 0) {
    const promises = appendix2Forms.map(appendix => {
      return transitionForm(user, appendix, {
        type: EventType.MarkAsGrouped
      });
    });
    await Promise.all(promises);
  }

  return expandFormFromDb(resentForm);
};

export default markAsSentResolver;
