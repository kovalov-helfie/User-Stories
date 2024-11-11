import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout } from '../layouts/default-layouts';
import { AdminClaimPage } from '../pages/admin-claim-page';
import { MarketPage } from '../pages/market-page';
import { HomePage } from '../pages/home-page';
import { AssetPage } from '../pages/asset-page';
import { AdminUserPage } from '../pages/admin-user-page';
import { AdminAssetPage } from '../pages/admin-asset-page';
import { AdminTokenCompliancePage } from '../pages/admin-token-compliance-request-page';
import { AddAssetClaimsPage } from '../pages/add-asset-claims-page';
import { AddTokenComplianceRequestPage } from '../pages/add-token-compliance-request-page';
import { DvdTransferPage } from '../pages/dvd-transfer-page';
import { AdminAssetClaimPage } from '../pages/admin-asset-claim-page';

export const routes = {
    home: '/',
    adminUser: '/admin-user',
    adminClaim: '/admin-claim/:userAddress',
    adminAsset: '/admin-asset',
    adminAssetClaim: '/admin-asset-claim/:tokenAddress',
    adminTokenCompliance: 'admin-token-compliance',
    asset: '/asset',
    market: '/market',
    assetClaim: '/asset-claim/:tokenAddress',
    tokenComplianceRequest: '/token-compliance-request/:tokenAddress',
    dvdTransfer: '/dvd-transfer/:tokenAddress'
}

export const router = createBrowserRouter([{
    path: routes.home, Component: DefaultLayout, children: [
        { path: routes.home, Component: HomePage },
        { path: routes.adminClaim, Component: AdminClaimPage },
        { path: routes.adminUser, Component: AdminUserPage },
        { path: routes.adminAsset, Component: AdminAssetPage },
        { path: routes.adminAssetClaim, Component: AdminAssetClaimPage },
        { path: routes.adminTokenCompliance, Component: AdminTokenCompliancePage },
        { path: routes.asset, Component: AssetPage },
        { path: routes.market, Component: MarketPage },
        { path: routes.assetClaim, Component: AddAssetClaimsPage },
        { path: routes.tokenComplianceRequest, Component: AddTokenComplianceRequestPage },
        { path: routes.dvdTransfer, Component: DvdTransferPage },
    ]
}])