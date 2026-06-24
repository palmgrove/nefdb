# Nigeria Emission Factor Database (NEFDB) Methodology

## Abstract

The Nigeria Emission Factor Database (NEFDB) is an open, versioned compilation of emission factors designed to support corporate greenhouse gas accounting for Nigerian organizations and their value chains. Version 1.0.2, referred to as NEFDB v1, presents Scope 1 and Scope 2 emission factors for grid electricity, stationary fuel combustion, road transport, domestic aviation, waste disposal and treatment, and water supply and wastewater treatment. Factors integrate internationally recognized guidance, including the Intergovernmental Panel on Climate Change Guidelines for National Greenhouse Gas Inventories and the GHG Protocol Corporate Standard, with Nigeria-specific data such as Nigerian Electricity Regulatory Commission generation statistics, National Bureau of Statistics electricity data, and Lagos wastewater measurements. Where local data are unavailable, transparent proxies are adopted and flagged with explicit uncertainty bands. Each source document is archived in the public source-document archive, and derived factors are published as CSV and JSON data files. This paper describes the data sources, derivation methods, quality-assurance workflow, and limitations of NEFDB v1.

## 1. Introduction

Corporate greenhouse gas reporting in Nigeria has historically relied on emission factors drawn from European, North American, or global default sources. These proxies can misstate Nigerian emissions because they assume grid mixes, vehicle fleets, fuel specifications, waste practices, and treatment efficiencies that differ from local conditions. A Nigeria-specific factor set reduces this bias and improves comparability across reports filed with the Nigerian Exchange Group, the Financial Reporting Council of Nigeria, and the Securities and Exchange Commission Nigeria.

NEFDB v1 is intended for sustainability professionals, corporate carbon accountants, auditors, researchers, and regulators. The database aligns with the GHG Protocol Corporate Standard (World Resources Institute & World Business Council for Sustainable Development, 2015a) and the GHG Protocol Scope 2 Guidance (World Resources Institute & World Business Council for Sustainable Development, 2015b). Factors are organized into six domains: grid electricity, fuel combustion, road transport, aviation, waste, and water treatment. Each factor carries a confidence rating and an uncertainty percentage so that users can judge fitness for purpose.

## 2. Data and Methodology Overview

The workflow used to build NEFDB v1 comprises four steps: source identification and appraisal, factor derivation, quality assurance, and publication.

Source identification and appraisal. Primary sources are authoritative documents from Nigerian government agencies, international bodies, and peer-reviewed literature. Each source is catalogued in a source inventory and, where redistribution is permitted, archived in the public source-document archive. Cross-check sources are retained to corroborate values and record data gaps.

Factor derivation. Emission factors are calculated from the source data using the methods documented in the following sections. Calculations favor simple, transparent formulas that can be reproduced from the archived inputs. All factors are expressed in metric units (kgCO2e per litre, kWh, kilometre, passenger-kilometre, tonne, cubic metre, or kilogram of chemical oxygen demand) and use the AR5 global warming potential values of 28 for methane and 265 for nitrous oxide unless otherwise noted.

Quality assurance. Each factor is checked for unit consistency, arithmetic correctness, and inventory coverage. Primary and corroborating source identifiers are validated against the source inventory. Factor values are exported to the published CSV and JSON data files, and the two files are compared for consistency.

Publication. Version 1.0.2 is released through GitHub. The published data files contain the final factor values. Source documents remain available through the public source-document archive so that third parties can reproduce or audit the derivation chain.

## 3. Grid Electricity

### 3.1 National grid margin factors

NEFDB v1 includes three national grid margin factors taken from the standardized baseline for the West African Power Pool including Nigeria (UNFCCC & West African Power Pool, 2021b). The baseline reports operating margin, build margin, and combined margin values for the WAPP grid, of which Nigeria is a member country. The baseline is corroborated by the associated assessment report (UNFCCC & West African Power Pool, 2021a). All three values are published in tonnes CO2 per megawatt-hour, which convert one-to-one to kilograms CO2e per kilowatt-hour because both the mass and energy units differ by a factor of one thousand.

The operating margin represents average emissions from existing dispatchable generation. The build margin represents recent capacity additions. The combined margin is a weighted combination used for project-level calculations. For wind and solar projects in the first crediting period, the UNFCCC CDM Methodological Tool 07 prescribes weights of 0.75 on the operating margin and 0.25 on the build margin (UNFCCC, 2021):

    CM = 0.75 × OM + 0.25 × BM

where CM is the combined margin, OM is the operating margin, and BM is the build margin.

Applying the formula to the WAPP values gives 0.75 × 0.578 + 0.25 × 0.556 = 0.573 kgCO2e/kWh, matching the published combined margin (UNFCCC & West African Power Pool, 2021b). The margin factors are reported as carbon dioxide only, so they do not depend on the global warming potential basis.

### 3.2 National location-based factor for 2024

The national location-based grid factor is derived from the NEFDB reconciled 2024 Nigerian generation mix (Nigeria Emission Factor Database, 2024), anchored to the Nigerian Electricity Regulatory Commission total generation and hydro share as reported by Guardian Nigeria (Guardian Nigeria & Nigerian Electricity Regulatory Commission, 2024) and cross-checked against Ember and Our World in Data electricity statistics (Ember & Our World in Data, 2024).

The reconciled mix for 2024 is:

| Fuel | Generation (GWh) |
|------|-----------------:|
| Gas | 25,433.85 |
| Oil | 0.00 |
| Hydro | 11,469.85 |
| Solar | 130.00 |
| Biomass | 60.00 |
| Other | 0.00 |
| Total | 37,093.70 |

The location-based emission factor is a generation-weighted average:

    EF_grid = sum(G_i × EF_i) / sum(G_i)

where G_i is generation from fuel i and EF_i is the fuel-specific emission factor.

Fuel-specific emission factors are computed from Intergovernmental Panel on Climate Change (2006a) default emission factors for stationary combustion. For natural gas, the default values are 56,100 kg CO2 per terajoule, 1 kg CH4 per terajoule, and 0.1 kg N2O per terajoule. Converting to a per-kilowatt-hour basis with 3.6 megajoules per kilowatt-hour and the AR5 global warming potentials gives:

    EF_gas = (56,100 + 1 × 28 + 0.1 × 265) × 3.6 / 10^6
           = 0.202156 kgCO2e/kWh

For residual fuel oil, the defaults are 77,400 kg CO2 per terajoule, 3 kg CH4 per terajoule, and 0.6 kg N2O per terajoule, yielding:

    EF_oil = (77,400 + 3 × 28 + 0.6 × 265) × 3.6 / 10^6
           = 0.279515 kgCO2e/kWh

Hydro, solar, wind, biomass, and other generation are treated as zero-emission. Because oil generation in 2024 is zero, the national factor is driven entirely by gas-fired generation:

    EF_grid = (25,433.85 × 0.202156 + 0 × 0.279515) / 37,093.70
            = 0.138611 kgCO2e/kWh

### 3.3 Distribution-company-level factors

Eleven distribution-company-level factors are derived from National Bureau of Statistics (2024) Q2 2024 billed energy data, the 2024 Nigerian generation mix (Nigerian Electricity Regulatory Commission & Nigeria Emission Factor Database, 2024), and the Intergovernmental Panel on Climate Change (2006a) stationary combustion defaults.

The 2024 national generation mix is anchored to 68.57 percent gas, 30.92 percent hydro, and 0.51 percent other. A territorial adjustment is applied because dispatch is not publicly available at the distribution-company level:

- Northern distribution companies (AEDC, JEDC, KDEDC, KEDC, YEDC): gas share reduced by 10 percentage points, hydro share increased by 10 percentage points.
- Western and central distribution companies (BEDC, IBEDC, IEDC): gas share increased by 2 percentage points, hydro share reduced by 2 percentage points.
- Southern distribution companies (EEDC, EKEDC, PEDC): gas share increased by 12 percentage points, hydro share reduced by 12 percentage points.

For each distribution company, the location-based factor is:

    EF_Disco = gas_pct × EF_gas

where gas_pct is the adjusted gas share and hydro and other shares contribute zero emissions. The resulting factors are shown in Table 1.

**Table 1: Distribution-company location-based grid emission factors for 2024**

| Distribution company | Gas share (%) | Emission factor (kgCO2e/kWh) | Confidence | Uncertainty (%) |
|----------------------|--------------:|-----------------------------:|------------|----------------:|
| AEDC | 58.57 | 0.118396 | Medium | 20 |
| BEDC | 70.57 | 0.142655 | Medium | 20 |
| EEDC | 80.57 | 0.162870 | Medium | 20 |
| EKEDC | 80.57 | 0.162870 | Medium | 20 |
| IBEDC | 70.57 | 0.142655 | Medium | 20 |
| IEDC | 70.57 | 0.142655 | Medium | 20 |
| JEDC | 58.57 | 0.118396 | Medium | 20 |
| KDEDC | 58.57 | 0.118396 | Medium | 20 |
| KEDC | 58.57 | 0.118396 | Medium | 20 |
| PEDC | 80.57 | 0.162870 | Medium | 20 |
| YEDC | 58.57 | 0.118396 | Medium | 20 |

## 4. Fuel Combustion

### 4.1 Stationary combustion factors

Stationary combustion factors for diesel, petrol, liquefied petroleum gas, compressed natural gas, natural gas, and heavy fuel oil are taken primarily from the UK DESNZ/DEFRA 2024 greenhouse gas conversion factors (U.K. Department for Energy Security and Net Zero, 2024). Each value is cross-checked against the Intergovernmental Panel on Climate Change (2006a) stationary combustion defaults and the U.S. Environmental Protection Agency (2024) emission factors hub. Differences among the three reference sets are typically within one to three percent for liquid fuels.

The adopted values are shown in Table 2.

**Table 2: Stationary combustion emission factors**

| Fuel | Emission factor | Unit | Confidence | Uncertainty (%) |
|------|----------------:|------|------------|----------------:|
| Diesel | 2.662 | kgCO2e/litre | High | 10 |
| Petrol | 2.354 | kgCO2e/litre | High | 10 |
| LPG | 1.557 | kgCO2e/litre | High | 10 |
| CNG | 2.568 | kgCO2e/kg | Medium | 15 |
| Natural gas | 2.045 | kgCO2e/m3 | High | 10 |
| Heavy fuel oil | 3.175 | kgCO2e/litre | Medium | 15 |

The natural gas factor assumes a grid-gas density consistent with the UK conversion factor set. Nigerian gas composition may differ, particularly in the wetness and heating value of associated gas from different fields (Nigerian National Petroleum Corporation, 2023), so the compressed natural gas and natural gas factors are flagged with medium confidence. Cubic-metre values for compressed natural gas require a density assumption; the per-kilogram value is therefore preferred.

### 4.2 Diesel electricity-generation factors

Two per-kilowatt-hour factors for diesel-powered electricity generation are derived from the stationary diesel factor by applying generator efficiency. The conversion is:

    EF_kWh = EF_litre / (kWh_thermal_per_litre × efficiency)

where EF_litre is the stationary diesel factor in kgCO2e per litre, kWh_thermal_per_litre is 9.927 kilowatt-hours of thermal energy per litre, and efficiency is the electrical conversion efficiency expressed as a decimal.

A rated-efficiency variant uses 33 percent, representative of modern generator sets:

    EF_rated = 2.662 / (9.927 × 0.33) = 0.813 kgCO2e/kWh

A field-efficiency variant uses 28 percent, reflecting the lower efficiency typical of older, poorly maintained on-site generator sets common in Nigeria (Somorin et al., 2017):

    EF_field = 2.662 / (9.927 × 0.28) = 0.958 kgCO2e/kWh

The field-efficiency value is the recommended default for Nigerian self-generated electricity inventories.

## 5. Road Transport

### 5.1 Fuel-based factors

The primary road-transport factors are fuel-based. Fuel purchase or consumption records are generally more reliable than vehicle-kilometre estimates in Nigerian corporate settings. Petrol and diesel factors match the stationary combustion values because the underlying emission factors for fully combusted mineral petrol and diesel are the same whether the fuel is burned in a stationary engine or a vehicle. The values are corroborated against the Intergovernmental Panel on Climate Change (2006b) mobile combustion defaults (Table 3).

**Table 3: Road-transport fuel-based emission factors**

| Fuel | Emission factor | Unit | Confidence | Uncertainty (%) |
|------|----------------:|------|------------|----------------:|
| Petrol | 2.354 | kgCO2e/litre | High | 10 |
| Diesel | 2.662 | kgCO2e/litre | High | 10 |

### 5.2 Distance-based factors

When only distance travelled is available, NEFDB v1 provides distance-based proxies derived from the UK DESNZ/DEFRA 2024 factors (U.K. Department for Energy Security and Net Zero, 2024). These are proxies because Nigeria-specific vehicle-kilometre, fuel-economy, and test-cycle data are not available in public sources. The World Bank (2013) Nigeria low-carbon development study provides annual-kilometre defaults that users may apply to vehicle-stock data, but those defaults are not used to derive the per-kilometre factors.

The adopted distance-based factors are shown in Table 4.

**Table 4: Road-transport distance-based emission factors**

| Vehicle class | Fuel | Emission factor | Unit | Confidence | Uncertainty (%) |
|---------------|------|----------------:|------|------------|----------------:|
| Passenger car | Petrol | 0.165 | kgCO2e/km | Medium | 20 |
| Passenger car | Diesel | 0.170 | kgCO2e/km | Medium | 20 |
| Motorcycle | Petrol | 0.114 | kgCO2e/km | Low | 30 |
| Urban bus | Diesel | 3.254 | kgCO2e/km | Low | 35 |
| Light truck or van | Diesel | 0.250 | kgCO2e/km | Medium | 20 |
| Heavy goods vehicle | Diesel | 0.873 | kgCO2e/km | Medium | 20 |

The bus factor is converted from a passenger-kilometre factor to a vehicle-kilometre factor using an assumed occupancy of 30 passengers:

    EF_vehicle_km = EF_passenger_km × occupancy
                  = 0.10846 × 30
                  = 3.254 kgCO2e/km

This conversion is sensitive to actual occupancy, so the bus factor is flagged with low confidence (International Council on Clean Transportation, 2019).

## 6. Aviation

Domestic aviation factors are derived from the International Civil Aviation Organization (2023) Carbon Emissions Calculator Methodology, version 13.1. The Nigerian Civil Aviation Authority (2023) 2022 executive summary provides national passenger and flight totals for context but does not publish aircraft-type, load-factor, or route-specific fuel-burn data.

For each route, great-circle distance is computed from airport coordinates and increased by 9 percent to obtain the flown stage length, following the ICAO standard uplift. A single representative aircraft is used because Nigerian domestic routes are served by a mixed narrow-body fleet and detailed fleet composition by route is unavailable. The representative aircraft is a Boeing 737-500 with 114 seats, at a 72 percent load factor. The Intra-Africa passenger-to-cargo factor of 0.8432 from the methodology is applied to attribute total flight emissions to passengers.

The per-passenger-kilometre factor is:

    EF_route = fuel_kg × 3.16 × 0.8432 / (seats × load_factor × stage_length_km)

where fuel_kg is interpolated from the ICAO fuel-consumption coefficients for the Boeing 737-500 at the route stage length, 3.16 is the kilograms of CO2 per kilogram of jet fuel, 0.8432 is the passenger-to-cargo factor, seats is 114, load_factor is 0.72, and stage_length_km is the uplifted great-circle distance in kilometres.

The resulting route-specific and generic factors are shown in Table 5. The generic factor is the arithmetic mean of the four route factors and is intended for use when the exact route is unknown.

**Table 5: Domestic aviation emission factors**

| Route | Emission factor | Unit | Confidence | Uncertainty (%) |
|-------|----------------:|------|------------|----------------:|
| Lagos - Abuja | 0.1962 | kgCO2e/passenger-km | Medium | 20 |
| Lagos - Port Harcourt | 0.2168 | kgCO2e/passenger-km | Medium | 20 |
| Lagos - Kano | 0.1489 | kgCO2e/passenger-km | Medium | 20 |
| Abuja - Port Harcourt | 0.2143 | kgCO2e/passenger-km | Medium | 20 |
| Nigeria domestic average | 0.1940 | kgCO2e/passenger-km | Medium | 20 |

An optional radiative-forcing multiplier of 1.9 is provided to account for non-CO2 climate effects such as contrails and cirrus cloud formation (Lee et al., 2021). The multiplier is not applied in the base factors. When used, the calculation is:

    EF_with_RF = EF_route × 1.9

## 7. Waste

### 7.1 Solid waste disposal

Municipal solid waste disposal factors are calculated using the Intergovernmental Panel on Climate Change (2006c) Tier 1 first-order decay model. Nigeria does not publish a national municipal solid waste composition table, so the Lagos metropolis mean composition is used as the best-available urban proxy. The degradable organic carbon fraction is:

    DOC = sum(frac_j × DOC_j)

where frac_j is the wet-mass fraction of waste component j and DOC_j is the degradable organic carbon fraction for that component. Using the Lagos composition gives DOC = 0.15024 kg carbon per kilogram of wet waste.

For managed landfills, the parameters are: DOCf = 0.5, F = 0.5, oxidation factor OX = 0.1, and methane correction factor MCF = 1.0. The methane emission factor is:

    EF_CH4 = DOC × DOCf × F × (16/12) × (1 - OX) × MCF × 1000
           = 0.15024 × 0.5 × 0.5 × 1.3333 × 0.9 × 1.0 × 1000
           = 45.07 kg CH4 / tonne

Converting to CO2e with a methane global warming potential of 28 gives:

    EF_CO2e = 45.07 × 28 = 1,260 kgCO2e/tonne

For unmanaged open dumps, the oxidation factor is zero and the methane correction factor is 0.4:

    EF_CH4 = 0.15024 × 0.5 × 0.5 × 1.3333 × 1.0 × 0.4 × 1000
           = 20.03 kg CH4 / tonne

    EF_CO2e = 20.03 × 28 = 561 kgCO2e/tonne

### 7.2 Open burning

Open burning of municipal solid waste uses the Intergovernmental Panel on Climate Change (2006e) default emission factors for unmanaged burning. Biogenic CO2 is excluded; only fossil CO2 is included. The default values are 33 kg CO2 per tonne, 6.5 kg CH4 per tonne, and 0.2 kg N2O per tonne (Nigeria Open Burning Factsheet, 2021). The CO2e factor is:

    EF_CO2e = 33 + (6.5 × 28) + (0.2 × 265)
            = 268 kgCO2e/tonne

### 7.3 Composting

The composting factor applies the Intergovernmental Panel on Climate Change (2006d) default wet-weight methane and nitrous oxide emission factors for aerobic composting: 4 kg CH4 per tonne and 0.24 kg N2O per tonne. Biogenic CO2 is excluded.

    EF_CO2e = (4 × 28) + (0.24 × 265)
            = 176 kgCO2e/tonne

### 7.4 Domestic wastewater

Domestic wastewater methane emissions are estimated with the Intergovernmental Panel on Climate Change (2006f) Tier 1 model:

    EF_CH4 = Bo × MCF

where Bo is the maximum methane-producing capacity and MCF is the methane correction factor. The default Bo is 0.6 kg CH4 per kilogram of biochemical oxygen demand. A national weighted MCF of 0.354 is inferred from the Federal Republic of Nigeria (2021) national inventory report by dividing reported 2017 methane emissions by total organically degradable material.

The per-cubic-metre factor uses an influent biochemical oxygen demand of 0.1275 kg per cubic metre from the Oke-Afa wastewater treatment plant characterisation study (Lagos State Wastewater Management Office & Nigeria Emission Factor Database, 2021):

    EF_CO2e = Bo × MCF × BOD × 28
            = 0.6 × 0.354 × 0.1275 × 28
            = 0.758 kgCO2e/m3

Nitrous oxide from domestic wastewater is not included because it depends on protein intake and is not captured in the available national data.

### 7.5 Industrial wastewater

Industrial wastewater uses the Intergovernmental Panel on Climate Change (2006f) chemical-oxygen-demand-based default. A conservative methane correction factor of 0.3 is applied to reflect overloaded aerobic or partial anaerobic treatment. The default Bo is 0.25 kg CH4 per kilogram of chemical oxygen demand:

    EF_CH4 = Bo × MCF = 0.25 × 0.3 = 0.0750 kg CH4/kg COD

    EF_CO2e = 0.0750 × 28 = 2.10 kgCO2e/kg COD

## 8. Water Treatment

Water supply and wastewater treatment services are treated as Scope 2 electricity factors. Local electricity-intensity data for Nigerian waterworks were not available, so UK DESNZ/DEFRA 2024 factors are used as proxies for electricity intensity and then converted to the Nigerian grid (U.K. Department for Energy Security and Net Zero, 2024; Nigeria Emission Factor Database, 2024).

For water supply:

    Intensity = 0.15311 / 0.20705 = 0.739 kWh/m3
    EF_CO2e = 0.739 × 0.138611 = 0.103 kgCO2e/m3

For wastewater treatment:

    Intensity = 0.18574 / 0.20705 = 0.897 kWh/m3
    EF_CO2e = 0.897 × 0.138611 = 0.124 kgCO2e/m3

## 9. Results

NEFDB v1 contains 45 emission factors across the six domains. Table 6 summarizes the final values, units, scopes, confidence levels, and uncertainty percentages.

**Table 6: Summary of NEFDB v1 emission factors**

| Domain | Factor description | Value | Unit | Scope | Confidence | Uncertainty (%) |
|--------|---------------------|------:|------|-------|------------|----------------:|
| Grid electricity | National operating margin | 0.578 | kgCO2e/kWh | 2 | High | 10 |
| Grid electricity | National build margin | 0.556 | kgCO2e/kWh | 2 | High | 10 |
| Grid electricity | National combined margin | 0.573 | kgCO2e/kWh | 2 | High | 10 |
| Grid electricity | National location-based 2024 | 0.138611 | kgCO2e/kWh | 2 | Medium | 15 |
| Grid electricity | Distribution-company factors | 0.118396 to 0.162870 | kgCO2e/kWh | 2 | Medium | 20 |
| Fuel combustion | Diesel stationary | 2.662 | kgCO2e/litre | 1 | High | 10 |
| Fuel combustion | Diesel electricity, rated efficiency | 0.813 | kgCO2e/kWh | 1 | Medium | 15 |
| Fuel combustion | Diesel electricity, field efficiency | 0.958 | kgCO2e/kWh | 1 | Medium | 18 |
| Fuel combustion | Petrol stationary | 2.354 | kgCO2e/litre | 1 | High | 10 |
| Fuel combustion | LPG stationary | 1.557 | kgCO2e/litre | 1 | High | 10 |
| Fuel combustion | CNG stationary | 2.568 | kgCO2e/kg | 1 | Medium | 15 |
| Fuel combustion | Natural gas stationary | 2.045 | kgCO2e/m3 | 1 | High | 10 |
| Fuel combustion | Heavy fuel oil stationary | 3.175 | kgCO2e/litre | 1 | Medium | 15 |
| Road transport | Petrol per litre | 2.354 | kgCO2e/litre | 1 | High | 10 |
| Road transport | Diesel per litre | 2.662 | kgCO2e/litre | 1 | High | 10 |
| Road transport | Petrol car per km | 0.165 | kgCO2e/km | 1 | Medium | 20 |
| Road transport | Diesel car per km | 0.170 | kgCO2e/km | 1 | Medium | 20 |
| Road transport | Petrol motorcycle per km | 0.114 | kgCO2e/km | 1 | Low | 30 |
| Road transport | Diesel bus per km | 3.254 | kgCO2e/km | 1 | Low | 35 |
| Road transport | Small diesel truck per km | 0.250 | kgCO2e/km | 1 | Medium | 20 |
| Road transport | Heavy diesel truck per km | 0.873 | kgCO2e/km | 1 | Medium | 20 |
| Aviation | Lagos - Abuja route | 0.1962 | kgCO2e/passenger-km | 1 | Medium | 20 |
| Aviation | Lagos - Port Harcourt route | 0.2168 | kgCO2e/passenger-km | 1 | Medium | 20 |
| Aviation | Lagos - Kano route | 0.1489 | kgCO2e/passenger-km | 1 | Medium | 20 |
| Aviation | Abuja - Port Harcourt route | 0.2143 | kgCO2e/passenger-km | 1 | Medium | 20 |
| Aviation | Generic domestic route | 0.1940 | kgCO2e/passenger-km | 1 | Medium | 20 |
| Aviation | Radiative-forcing multiplier | 1.9 | dimensionless | 1 | Medium | 30 |
| Waste | Managed landfill | 1,260 | kgCO2e/tonne | 1 | High | 20 |
| Waste | Open dump | 561 | kgCO2e/tonne | 1 | Medium | 25 |
| Waste | Open burning | 268 | kgCO2e/tonne | 1 | Medium | 35 |
| Waste | Composting | 176 | kgCO2e/tonne | 1 | High | 25 |
| Waste | Domestic wastewater | 0.758 | kgCO2e/m3 | 1 | Medium | 30 |
| Waste | Industrial wastewater | 2.10 | kgCO2e/kg COD | 1 | Low | 40 |
| Water | Water supply | 0.103 | kgCO2e/m3 | 2 | Medium | 30 |
| Water | Wastewater treatment | 0.124 | kgCO2e/m3 | 2 | Medium | 30 |

## 10. Limitations and Uncertainty

Several limitations affect the interpretability of NEFDB v1 factors.

Grid electricity. The 2024 national generation total and hydro share are sourced through a Guardian Nigeria summary of Nigerian Electricity Regulatory Commission data (Guardian Nigeria & Nigerian Electricity Regulatory Commission, 2024) because the official annual report was not available at the time of writing. Oil, solar, biomass, and other generation are small shares treated as zero-emission. Transmission and distribution losses are excluded, so the factors should be applied to generation or billed-energy denominators consistently. Upstream fugitive methane from natural gas production and transportation is also excluded.

Fuel combustion. The compressed natural gas and natural gas factors assume a UK gas density. Nigerian gas composition may differ, particularly in the wetness and heating value of associated gas from different fields.

Road transport and water treatment. Distance-based road factors and both water-treatment factors rely on UK proxies because Nigeria-specific vehicle fuel-economy, vehicle-kilometre, and waterworks electricity-intensity data are not publicly available. The bus factor is highly sensitive to the assumed 30-passenger occupancy.

Aviation. The route factors depend on a single representative aircraft, the Boeing 737-500, and an assumed 72 percent load factor. Actual Nigerian domestic operations use a mix of aircraft types and load factors that vary by route and season. The radiative-forcing multiplier is metric- and time-horizon-dependent and is provided only as an optional adjustment.

Waste. There is no national municipal solid waste composition table for Nigeria. The managed-landfill, open-dump, and open-burning factors therefore use the Lagos metropolis mean composition as a proxy. The domestic wastewater factor is based on a single Lagos treatment plant for influent biochemical oxygen demand, and industrial wastewater uses a conservative default methane correction factor because sector-level treatment data are unavailable.

## 11. Conclusion

NEFDB v1 provides a transparent, Nigeria-focused set of Scope 1 and Scope 2 emission factors for the most common corporate reporting categories. By combining international guidance with Nigeria-specific data and clearly documenting proxies and uncertainty, the database offers a practical starting point for Nigerian Exchange Group, Financial Reporting Council of Nigeria, and Securities and Exchange Commission Nigeria reporting, as well as for corporate carbon accounting and research. As new Nigerian energy, transport, waste, and water data become available, the factors can be updated while preserving the documented audit trail in the source inventory, the published data files, and the public source-document archive.

## References

Ember & Our World in Data. (2024). Ember yearly electricity data / Our World in Data energy dataset. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/international/ember_yearly_full_release_long_format.csv

Federal Republic of Nigeria. (2021). Nigeria first national inventory report 2000-2017.

Guardian Nigeria & Nigerian Electricity Regulatory Commission. (2024). Guardian Nigeria summary of NERC 2024 annual statistics.

Intergovernmental Panel on Climate Change. (2006a). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 2. Energy, Chapter 2: Stationary combustion. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ipcc_2006gl_vol2_ch2_stationary_combustion.pdf

Intergovernmental Panel on Climate Change. (2006b). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 2. Energy, Chapter 3: Mobile combustion. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ipcc_2006_vol2_ch3_mobile_combustion.pdf

Intergovernmental Panel on Climate Change. (2006c). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 5. Waste, Chapter 3: Solid waste disposal.

Intergovernmental Panel on Climate Change. (2006d). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 5. Waste, Chapter 4: Biological treatment of solid waste.

Intergovernmental Panel on Climate Change. (2006e). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 5. Waste, Chapter 5: Incineration and open burning of waste.

Intergovernmental Panel on Climate Change. (2006f). 2006 IPCC guidelines for national greenhouse gas inventories: Vol. 5. Waste, Chapter 6: Wastewater treatment and discharge.

International Civil Aviation Organization. (2023). Carbon emissions calculator methodology: Version 13.1. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/icao_icec_v13_1.pdf

International Council on Clean Transportation. (2019). Soot-free transport for Nigeria. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/icct_soot_free_transport_nigeria.pdf

Lagos State Wastewater Management Office & Nigeria Emission Factor Database. (2021). Oke-Afa wastewater treatment plant characterisation study. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/oke_afa_wwtp_lagos_2021.pdf

Lee, D. S., Fahey, D. W., Skowron, A., Allen, M. R., Burkhardt, U., Chen, Q., Doherty, S. J., Freeman, S., Forster, P. M., Fuglestvedt, J., Gettelman, A., De León, R. R., Lim, L. L., Lund, M. T., Millar, R. J., Owen, B., Penner, J. E., Pitari, G., Prather, M. J., Wilcox, L. J., & Wilson, R. J. (2021). The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018. Atmospheric Environment, 244, 117834. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/lee_et_al_2021_aviation_rf.pdf

National Bureau of Statistics. (2024). Nigeria electricity data 2015-Q2 2024. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ELECTRICITY_DATA_2015-Q2_2024.xlsx

Nigeria Emission Factor Database. (2024). Nigeria generation mix reconciled 2024. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/nigeria_generation_mix_reconciled.csv

Nigeria open burning factsheet. (2021). https://nefdb-r2-publisher.ugbodagadavid.workers.dev/NIGERIA-OPEN%20BURNING.pdf

Nigerian Civil Aviation Authority. (2023). Executive summary: January-December 2022. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ncaa_summaries/NCAA_2022_annual_executive_summary.pptx

Nigerian Electricity Regulatory Commission & Nigeria Emission Factor Database. (2024). Nigeria generation mix 2024 (NERC / Guardian Nigeria / NEFDB reconciled). https://nefdb-r2-publisher.ugbodagadavid.workers.dev/nigeria_generation_mix_reconciled.csv

Nigerian National Petroleum Corporation. (2023). Annual statistics bulletin S3. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/rank1_NNPC_Annual_Statistics_Bulletin_S3.pdf

Somorin, T. O., Kolios, A. J., Ferrando, N., Basurto, R., & Bosoaga, A. (2017). Life cycle assessment of self-generated electricity in Nigeria. Renewable Energy. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/rank15_Somorin_etal_RE2017_Life_cycle_assessment_of_self_generated_electricity_in_Nigeria.pdf

U.K. Department for Energy Security and Net Zero. (2024). UK DESNZ/DEFRA 2024 greenhouse gas conversion factors full set. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/uk_defra_2024_conversion_factors_full_set.xlsx

UNFCCC. (2021). CDM methodological tool 07: Tool to calculate the emission factor for an electricity system (Version 7.0). https://nefdb-r2-publisher.ugbodagadavid.workers.dev/unfccc_cdm_tool07_v7.pdf

UNFCCC & West African Power Pool. (2021a). Assessment report ASU006 ASB0034 WAPP. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/Assessment_report_ASU006_ASB0034_WAPP.pdf

UNFCCC & West African Power Pool. (2021b). Standardized baseline for WAPP including Nigeria (ASB0034-2021). https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ASB0034-2021.pdf

U.S. Environmental Protection Agency. (2024). GHG emission factors hub 2024. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/epa_ghg_emission_factors_hub_2024.pdf

World Bank. (2013). Assessing low-carbon development in Nigeria: An analysis of four sectors. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/rank7_Low-carbon-development-opportunities-for-Nigeria.pdf

World Resources Institute & World Business Council for Sustainable Development. (2015a). GHG Protocol corporate accounting and reporting standard: Revised edition. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/rank12_ghg-protocol-revised.pdf

World Resources Institute & World Business Council for Sustainable Development. (2015b). GHG Protocol scope 2 guidance: An amendment to the GHG Protocol corporate standard. https://nefdb-r2-publisher.ugbodagadavid.workers.dev/ghg_protocol_scope2_guidance.pdf
