import {
  checkCanReadUpdateDeleteForm,
  checkCanMarkAsSealed,
  checkCanSignedByTransporter,
  checkCanMarkAsReceived,
  checkCanMarkAsProcessed,
  checkCanMarkAsTempStored,
  checkCanMarkAsResent,
  checkSecurityCode
} from "../permissions";
import {
  userFactory,
  formFactory,
  userWithCompanyFactory,
  formWithTempStorageFactory,
  companyFactory
} from "../../__tests__/factories";
import { prisma, User, Form } from "../../generated/prisma-client";
import { ErrorCode } from "../../common/errors";
import { resetDatabase } from "../../../integration-tests/helper";

async function checkOwnerPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const user = await userFactory();
  const form = await formFactory({ ownerId: user.id });
  return permission(user, form);
}

async function checkEmitterPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formFactory({
    ownerId: owner.id,
    opt: { emitterCompanySiret: company.siret }
  });
  return permission(user, form);
}

async function checkRecipientPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formFactory({
    ownerId: owner.id,
    opt: { recipientCompanySiret: company.siret }
  });
  return permission(user, form);
}

async function checkTransporterPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formFactory({
    ownerId: owner.id,
    opt: { transporterCompanySiret: company.siret }
  });
  return permission(user, form);
}

async function checkTraderPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formFactory({
    ownerId: owner.id,
    opt: { traderCompanySiret: company.siret }
  });
  return permission(user, form);
}

async function checkEcoOrganismePermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const ecoOrganisme = await prisma.createEcoOrganisme({
    siret: company.siret,
    name: "EO",
    address: ""
  });
  const form = await formFactory({
    ownerId: owner.id,
    opt: { ecoOrganisme: { connect: { id: ecoOrganisme.id } } }
  });
  return permission(user, form);
}

async function checkTransporterAfterTempStoragePermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formWithTempStorageFactory({
    ownerId: owner.id
  });
  const tempStorageDetail = await prisma
    .form({ id: form.id })
    .temporaryStorageDetail();
  await prisma.updateTemporaryStorageDetail({
    data: { transporterCompanySiret: company.siret },
    where: { id: tempStorageDetail.id }
  });
  return permission(user, form);
}

async function checkDestinationAfterTempStoragePermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formWithTempStorageFactory({
    ownerId: owner.id
  });
  const tempStorageDetail = await prisma
    .form({ id: form.id })
    .temporaryStorageDetail();
  await prisma.updateTemporaryStorageDetail({
    data: { destinationCompanySiret: company.siret },
    where: { id: tempStorageDetail.id }
  });
  return permission(user, form);
}

async function checkMultiModalTransporterPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const { user, company } = await userWithCompanyFactory("MEMBER");
  const form = await formWithTempStorageFactory({
    ownerId: owner.id
  });
  await prisma.createTransportSegment({
    form: { connect: { id: form.id } },
    transporterCompanySiret: company.siret
  });
  return permission(user, form);
}

async function checkRandomUserPermission(
  permission: (user: User, form: Form) => Promise<boolean>
) {
  const owner = await userFactory();
  const user = await userFactory();
  const form = await formWithTempStorageFactory({
    ownerId: owner.id
  });
  return permission(user, form);
}

describe("checkCanReadUpdateDeleteForm", () => {
  afterAll(resetDatabase);

  const permission = checkCanReadUpdateDeleteForm;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow owner", async () => {
    const check = await checkOwnerPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow emitter", async () => {
    const check = await checkEmitterPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow transporter", async () => {
    const check = await checkTransporterPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow trader", async () => {
    const check = await checkTraderPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow ecoOrganisme", async () => {
    const check = await checkEcoOrganismePermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow transporter after temp storage", async () => {
    const check = await checkTransporterAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow destination after temp storage", async () => {
    const check = await checkDestinationAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow multimodal transporter", async () => {
    const check = await checkMultiModalTransporterPermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanMarkAsSealed", () => {
  afterAll(resetDatabase);

  const permission = checkCanMarkAsSealed;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });
  it("should allow owner", async () => {
    const check = await checkOwnerPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow emitter", async () => {
    const check = await checkEmitterPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow transporter", async () => {
    const check = await checkTransporterPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow trader", async () => {
    const check = await checkTraderPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow destination after temp storage", async () => {
    const check = await checkDestinationAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanSignedByTransporter", () => {
  afterAll(resetDatabase);

  const permission = checkCanSignedByTransporter;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow transporter", async () => {
    const check = await checkTransporterPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow transporter after temp storage", async () => {
    const check = await checkTransporterAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanMarkAsReceived", () => {
  afterAll(resetDatabase);

  const permission = checkCanMarkAsReceived;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow destination after temp storage", async () => {
    const check = await checkDestinationAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanMarkAsProcessed", () => {
  afterAll(resetDatabase);

  const permission = checkCanMarkAsProcessed;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });

  it("should allow destination after temp storage", async () => {
    const check = await checkDestinationAfterTempStoragePermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanMarkAsTempStored", async () => {
  afterAll(resetDatabase);

  const permission = checkCanMarkAsTempStored;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkCanMarkAsResent", async () => {
  afterAll(resetDatabase);

  const permission = checkCanMarkAsResent;

  it("should deny access to random user", async () => {
    expect.assertions(1);
    try {
      await checkRandomUserPermission(permission);
    } catch (err) {
      expect(err.extensions.code).toEqual(ErrorCode.FORBIDDEN);
    }
  });

  it("should allow recipient", async () => {
    const check = await checkRecipientPermission(permission);
    expect(check).toEqual(true);
  });
});

describe("checkSecurityCode", async () => {
  afterAll(resetDatabase);

  test("securityCode is valid", async () => {
    const company = await companyFactory();
    const check = await checkSecurityCode(company.siret, company.securityCode);
    expect(check).toEqual(true);
  });

  test("securityCode is invalid", async () => {
    const company = await companyFactory();
    const checkFn = () => checkSecurityCode(company.siret, 1258478956);
    expect(checkFn).rejects.toThrow(
      "Le code de sécurité de l'émetteur du bordereau est invalide."
    );
  });
});