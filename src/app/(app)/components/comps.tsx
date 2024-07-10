import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ResyncWidget from "@/components/widget/widget";

type Props = {};

const Comps = (props: Props) => {
  return (
    <div>
      <div className="m-4 ">
        <NextUIProvider>
          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            children={undefined}
          />

          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            searchButtonType="icon"
            children={undefined}
          />

          <ResyncWidget
            // authorization={process.env.RESYNC_API_KEY! as string}
            // integrationId={process.env.RESYNC_INTEGRATION_ID! as string}
            authorization="884fef34-4c00-4d85-9a29-21adf9621523"
            integrationId="76882c33-61b7-460d-88b8-260cce563643"
            organizationDisplayName="Resync Ai"
            // title="Hi!"
            description="How can i Help?"
            primaryBrandColor="hsl(var--primary)"
            searchButtonType="iconSearch"
            children={undefined}
          />
        </NextUIProvider>
      </div>
    </div>
  );
};

export default Comps;
