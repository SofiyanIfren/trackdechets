import {
  IconBSDa,
  IconDuplicateFile,
  IconRenewableEnergyEarth,
  IconWarehouseDelivery,
  IconWarehousePackage,
  IconWaterDam,
} from "common/components/Icons";
import routes from "common/routes";
import { useDuplicate } from "dashboard/components/BSDList/BSDa/BSDaActions/useDuplicate";
import { statusLabels } from "dashboard/constants";
import styles from "dashboard/detail/common/BSDDetailContent.module.scss";
import { DateRow, DetailRow } from "dashboard/detail/common/Components";
import { getVerboseAcceptationStatus } from "dashboard/detail/common/utils";
import { PACKAGINGS_NAMES } from "form/bsda/components/packagings/Packagings";
import { Bsda, FormCompany } from "generated/graphql/types";
import React from "react";
import QRCodeIcon from "react-qr-code";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

type CompanyProps = {
  company?: FormCompany | null;
  label: string;
};
const Company = ({ company, label }: CompanyProps) => (
  <>
    <dt>{label}</dt> <dd>{company?.name}</dd>
    <dt>Siret</dt> <dd>{company?.siret}</dd>
    <dt>Adresse</dt> <dd>{company?.address}</dd>
    <dt>Tél</dt> <dd>{company?.phone}</dd>
    <dt>Mél</dt> <dd>{company?.mail}</dd>
    <dt>Contact</dt> <dd>{company?.contact}</dd>
  </>
);

type SlipDetailContentProps = {
  form: Bsda;
  children?: React.ReactNode;
  refetch?: () => void;
};

const Emitter = ({ form }: { form: Bsda }) => {
  const { emitter } = form;
  return (
    <div className={styles.detailColumns}>
      <div className={styles.detailGrid}>
        <Company label="Émetteur" company={emitter?.company} />
        <DetailRow
          value={emitter?.pickupSite?.name}
          label="Nom du chantier/collecte"
        />
        <DetailRow
          value={emitter?.pickupSite?.address}
          label="Adresse chantier/collecte"
        />
        <DetailRow
          value={emitter?.pickupSite?.infos}
          label="Informations complémentaires"
        />
        {!!emitter?.pickupSite?.address && (
          <>
            <dt>Adresse</dt>
            <dd>
              {emitter?.pickupSite?.address} {emitter?.pickupSite?.postalCode}{" "}
              {emitter?.pickupSite?.city}
            </dd>
          </>
        )}
      </div>
      <div className={styles.detailGrid}>
        <DateRow value={emitter?.emission?.signature?.date} label="Signé le" />
        <DetailRow
          value={emitter?.emission?.signature?.author}
          label="Signé par"
        />
      </div>
    </div>
  );
};

const Worker = ({ form }: { form: Bsda }) => {
  const { worker } = form;
  return (
    <div className={styles.detailColumns}>
      <div className={styles.detailGrid}>
        <Company label="Entreprise de travaux" company={worker?.company} />
      </div>
      <div className={styles.detailGrid}>
        <DateRow value={worker?.work?.signature?.date} label="Signé le" />
        <DetailRow value={worker?.work?.signature?.author} label="Signé par" />
      </div>
    </div>
  );
};

const Transporter = ({ form }: { form: Bsda }) => {
  const { transporter } = form;
  return (
    <>
      <div className={styles.detailGrid}>
        <Company label="Transporteur" company={transporter?.company} />
      </div>
      <div className={styles.detailGrid}>
        <DetailRow
          value={transporter?.recepisse?.number}
          label="Numéro de récépissé"
        />
        <DetailRow
          value={transporter?.recepisse?.department}
          label="Département"
        />
        <DateRow
          value={transporter?.recepisse?.validityLimit}
          label="Date de validité"
        />
      </div>
      <div className={`${styles.detailGrid} `}>
        <DateRow
          value={transporter?.transport?.takenOverAt}
          label="Emporté le"
        />
        <DateRow
          value={transporter?.transport?.signature?.date}
          label="Signé le"
        />
        <DetailRow
          value={transporter?.transport?.signature?.author}
          label="Signé par"
        />
        <DetailRow
          value={transporter?.customInfo}
          label="Informations tranporteur"
        />
        <DateRow
          value={transporter?.transport?.plates?.join(", ")}
          label="Immatriculations"
        />
      </div>
    </>
  );
};

const Recipient = ({ form }: { form: Bsda }) => {
  const { destination } = form;

  return (
    <>
      <div className={styles.detailGrid}>
        <Company label="Destinataire" company={destination?.company} />
      </div>
      <div className={styles.detailGrid}>
        <DetailRow
          value={destination?.reception?.weight}
          label="Poids reçu"
          units="tonne(s)"
        />
      </div>
      <div className={styles.detailGrid}>
        <DetailRow
          value={getVerboseAcceptationStatus(
            destination?.reception?.acceptationStatus
          )}
          label="Lot accepté"
        />
        <DetailRow
          value={destination?.reception?.refusalReason}
          label="Motif de refus"
        />
        <DetailRow
          value={destination?.reception?.signature?.author}
          label="Réception signée par"
        />
        <DateRow
          value={destination?.reception?.signature?.date}
          label="Réception signée le"
        />
      </div>
      <div className={styles.detailGrid}>
        <DetailRow
          value={destination?.operation?.code}
          label="Opération de traitement"
        />
        <DateRow
          value={destination?.operation?.date}
          label="Traitement effectué le"
        />

        <DetailRow
          value={destination?.operation?.signature?.author}
          label="Traitement signé par"
        />
        <DateRow
          value={destination?.operation?.signature?.date}
          label="Traitement signé le"
        />
        <DetailRow
          value={destination?.customInfo}
          label="Informations destinataire"
        />
      </div>
    </>
  );
};

const Broker = ({ broker }) => (
  <>
    <div className={styles.detailColumns}>
      <div className={styles.detailGrid}>
        <dt>Courtier</dt>
        <dd>{broker.company?.name}</dd>

        <dt>Siret</dt>
        <dd>{broker.company?.siret}</dd>

        <dt>Adresse</dt>
        <dd>{broker.company?.address}</dd>

        <dt>Tél</dt>
        <dd>{broker.company?.phone}</dd>

        <dt>Mél</dt>
        <dd>{broker.company?.mail}</dd>

        <dt>Contact</dt>
        <dd>{broker.company?.contact}</dd>
      </div>
      <div className={styles.detailGrid}>
        <DetailRow value={broker.recepisse?.number} label="Récépissé" />
        <DetailRow value={broker.recepisse?.department} label="Départment" />
        <DateRow
          value={broker.recepisse?.validityLimit}
          label="Date de validité"
        />
      </div>
    </div>
  </>
);

export default function BsdaDetailContent({ form }: SlipDetailContentProps) {
  const { siret } = useParams<{ siret: string }>();
  const history = useHistory();

  const [duplicate] = useDuplicate({
    variables: { id: form.id },
    onCompleted: () => {
      history.push(
        generatePath(routes.dashboard.bsds.drafts, {
          siret,
        })
      );
    },
  });
  return (
    <div className={styles.detail}>
      <div className={styles.detailSummary}>
        <h4 className={styles.detailTitle}>
          <IconBSDa className="tw-mr-2" />
          <span className={styles.detailStatus}>
            [{form.isDraft ? "Brouillon" : statusLabels[form["bsdaStatus"]]}]
          </span>
          {!form.isDraft && <span>{form.id}</span>}
          {!!form?.grouping?.length && <span>Bordereau de groupement</span>}
        </h4>

        <div className={styles.detailContent}>
          <div className={`${styles.detailQRCodeIcon}`}>
            {!form.isDraft && (
              <div className={styles.detailQRCode}>
                <QRCodeIcon value={form.id} size={96} />
                <span>Ce QR code contient le numéro du bordereau </span>
              </div>
            )}
          </div>
          <div className={styles.detailGrid}>
            <DateRow
              value={form.updatedAt}
              label="Dernière action sur le BSD"
            />
            <dt>Code déchet</dt>
            <dd>{form.waste?.code}</dd>
            <dt>Description du déchet</dt>
            <dd>
              {form.waste?.materialName} {form.waste?.familyCode}
            </dd>
          </div>

          <div className={styles.detailGrid}>
            <dt>Code onu</dt>
            <dd>{form?.waste?.adr}</dd>

            <dt>Conditionnement</dt>
            <dd>
              {form?.packagings
                ?.map(p => `${p.quantity} ${PACKAGINGS_NAMES[p.type]}`)
                .join(", ")}
            </dd>

            <dt>Scellés</dt>
            <dd>{form?.waste?.sealNumbers?.join(", ")}</dd>
          </div>

          <div className={styles.detailGrid}>
            {form?.grouping?.length && (
              <>
                <dt>Bordereau groupés:</dt>
                <dd> {form?.grouping?.join(", ")}</dd>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs selectedTabClassName={styles.detailTabSelected}>
        {/* Tabs menu */}
        <TabList className={styles.detailTabs}>
          <Tab className={styles.detailTab}>
            <IconWaterDam size="25px" />
            <span className={styles.detailTabCaption}>Producteur</span>
          </Tab>

          {!!form?.worker?.company?.name && (
            <Tab className={styles.detailTab}>
              <IconWaterDam size="25px" />
              <span className={styles.detailTabCaption}>
                Entreprise de travaux
              </span>
            </Tab>
          )}

          {!!form?.broker?.company?.name && (
            <Tab className={styles.detailTab}>
              <IconWarehousePackage size="25px" />
              <span className={styles.detailTabCaption}>Courtier</span>
            </Tab>
          )}

          {!!form?.transporter?.company?.name && (
            <Tab className={styles.detailTab}>
              <IconWarehouseDelivery size="25px" />
              <span className={styles.detailTabCaption}>
                <span> Transporteur</span>
              </span>
            </Tab>
          )}

          <Tab className={styles.detailTab}>
            <IconRenewableEnergyEarth size="25px" />
            <span className={styles.detailTabCaption}>Destinataire</span>
          </Tab>
        </TabList>
        {/* Tabs content */}
        <div className={styles.detailTabPanels}>
          {/* Emitter tab panel */}
          <TabPanel className={styles.detailTabPanel}>
            <Emitter form={form} />
          </TabPanel>

          {/* Worker tab panel */}
          {!!form?.worker?.company?.name && (
            <TabPanel className={styles.detailTabPanel}>
              <Worker form={form} />
            </TabPanel>
          )}

          {/* Broker tab panel */}
          {!!form?.broker?.company?.name && (
            <TabPanel className={styles.detailTabPanel}>
              <Broker broker={form.broker} />
            </TabPanel>
          )}

          {/* Transporter tab panel */}
          {!!form?.transporter?.company?.name && (
            <TabPanel className={styles.detailTabPanel}>
              <Transporter form={form} />
            </TabPanel>
          )}

          {/* Recipient  tab panel */}
          <TabPanel className={styles.detailTabPanel}>
            <div className={styles.detailColumns}>
              <Recipient form={form} />
            </div>
          </TabPanel>
        </div>
      </Tabs>
      <div className={styles.detailActions}>
        <button
          className="btn btn--outline-primary"
          onClick={() => duplicate()}
        >
          <IconDuplicateFile size="24px" color="blueLight" />
          <span>Dupliquer</span>
        </button>
      </div>
    </div>
  );
}
