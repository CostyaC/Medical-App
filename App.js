// ======================================================
// CALCULADORA PEDIÁTRICA
// Amoxicilina + Ácido Clavulânico
// ======================================================


// ======================================================
// FORMULATIONS
// Calculations use the AMOXICILLIN component.
// ======================================================

const formulations = {

    "400": {
        label: "400 mg + 57 mg / 5 mL",
        amoxicillinMgPerMl: 80,
        ratio: "7:1"
    },

    "600": {
        label: "600 mg + 42,9 mg / 5 mL",
        amoxicillinMgPerMl: 120,
        ratio: "14:1"
    }

};


// ======================================================
// HTML ELEMENTS
// ======================================================

const indication =
    document.getElementById("indication");

const formulation =
    document.getElementById("formulation");

const yearsInput =
    document.getElementById("years");

const monthsInput =
    document.getElementById("months");

const weightInput =
    document.getElementById("weight");

const calculateButton =
    document.getElementById("calculateButton");


const result =
    document.getElementById("result");

const doseMl =
    document.getElementById("doseMl");

const mgPerDose =
    document.getElementById("mgPerDose");

const frequency =
    document.getElementById("frequency");

const dailyDose =
    document.getElementById("dailyDose");

const duration =
    document.getElementById("duration");

const formulaInfo =
    document.getElementById("formulaInfo");


const messageBox =
    document.getElementById("messageBox");

const messageTitle =
    document.getElementById("messageTitle");

const messageText =
    document.getElementById("messageText");


// ======================================================
// DISPLAY HELPERS
// ======================================================

function hideOutput() {

    result.classList.add("hidden");

    messageBox.classList.add("hidden");

}


function showMessage(title, text) {

    result.classList.add("hidden");

    messageTitle.textContent = title;

    messageText.textContent = text;

    messageBox.classList.remove("hidden");

}


// Display liquid dose with exactly two decimal places.
function formatMl(value) {

    return value.toLocaleString(
        "pt-PT",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// Display milligrams with up to two decimal places.
function formatMg(value) {

    return value.toLocaleString(
        "pt-PT",
        {
            maximumFractionDigits: 2
        }
    );

}


// ======================================================
// MAIN CALCULATOR
// ======================================================

calculateButton.addEventListener(
    "click",
    function () {

        hideOutput();


        // --------------------------------------------------
        // READ INPUTS
        // --------------------------------------------------

        const selectedIndication =
            indication.value;

        const selectedFormulation =
            formulation.value;

        const weight =
            Number(weightInput.value);

        const years =
            yearsInput.value === ""
                ? 0
                : Number(yearsInput.value);

        const months =
            monthsInput.value === ""
                ? 0
                : Number(monthsInput.value);


        // --------------------------------------------------
        // INDICATION VALIDATION
        // --------------------------------------------------

        if (selectedIndication === "") {

            showMessage(
                "Indicação necessária",
                "Selecione a indicação clínica."
            );

            return;
        }


        // ==================================================
        // ACUTE BRONCHITIS
        // No routine antibiotic calculation.
        // ==================================================

        if (selectedIndication === "bronchitis") {

            showMessage(
                "Cálculo não suportado",
                "Os antibióticos não são recomendados por rotina na bronquite aguda não complicada. Requer avaliação clínica."
            );

            return;
        }


        // ==================================================
        // STANDARD GAS TONSILLITIS / PHARYNGITIS
        // Plain amoxicillin is first-line in our specification.
        // ==================================================

        if (selectedIndication === "tonsillitis") {

            showMessage(
                "Amoxicilina simples é a 1.ª linha",
                "Na faringoamigdalite estreptocócica sintomática, a orientação INFARMED/CNFT utilizada neste protótipo apresenta amoxicilina simples como tratamento de 1.ª linha. Este calculador de amoxicilina + ácido clavulânico não calcula automaticamente esta indicação."
            );

            return;
        }


        // --------------------------------------------------
        // FORMULATION
        // --------------------------------------------------

        if (selectedFormulation === "") {

            showMessage(
                "Apresentação necessária",
                "Selecione a concentração da suspensão oral."
            );

            return;
        }


        // --------------------------------------------------
        // WEIGHT
        // --------------------------------------------------

        if (
            !Number.isFinite(weight) ||
            weight <= 0
        ) {

            showMessage(
                "Peso inválido",
                "Introduza um peso válido em quilogramas."
            );

            return;
        }


        // --------------------------------------------------
        // AGE
        // --------------------------------------------------

        if (
            !Number.isFinite(years) ||
            !Number.isFinite(months) ||
            years < 0 ||
            months < 0 ||
            months > 11
        ) {

            showMessage(
                "Idade inválida",
                "Introduza a idade em anos e meses. Os meses devem estar entre 0 e 11."
            );

            return;
        }


        const totalMonths =
            (years * 12) + months;


        const selected =
            formulations[selectedFormulation];


        // ==================================================
        // ACUTE OTITIS MEDIA
        // ==================================================

        if (selectedIndication === "otitis") {

            /*
                Clinical rule encoded in this prototype:

                90 mg amoxicillin / kg / day

                Maximum:
                3000 mg amoxicillin / day

                Frequency:
                every 12 hours
                = 2 administrations/day
            */


            // --------------------------------------------------
            // 600 + 42.9 mg / 5 mL safeguards
            // --------------------------------------------------

            if (
                selectedFormulation === "600" &&
                totalMonths < 3
            ) {

                showMessage(
                    "Cálculo não suportado",
                    "A apresentação 600 mg + 42,9 mg / 5 mL utilizada nesta especificação não fornece recomendação para crianças com menos de 3 meses."
                );

                return;
            }


            if (
                selectedFormulation === "600" &&
                weight >= 40
            ) {

                showMessage(
                    "Cálculo não suportado",
                    "Para peso igual ou superior a 40 kg, este calculador não aplica a recomendação pediátrica da apresentação 600 mg + 42,9 mg / 5 mL."
                );

                return;
            }


            // --------------------------------------------------
            // CALCULATION
            // --------------------------------------------------

            const rawDailyMg =
                weight * 90;


            const finalDailyMg =
                Math.min(
                    rawDailyMg,
                    3000
                );


            const amoxicillinPerDose =
                finalDailyMg / 2;


            const mlPerDose =
                amoxicillinPerDose /
                selected.amoxicillinMgPerMl;


            // --------------------------------------------------
            // DURATION
            // --------------------------------------------------

            let treatmentDuration;


            if (years < 2) {

                treatmentDuration =
                    "7 dias";

            } else {

                treatmentDuration =
                    "5 dias*";

            }


            // --------------------------------------------------
            // DISPLAY RESULT
            // --------------------------------------------------

            doseMl.textContent =
                formatMl(mlPerDose);


            mgPerDose.textContent =
                formatMg(amoxicillinPerDose)
                + " mg";


            frequency.textContent =
                "12/12 horas";


            dailyDose.textContent =
                formatMg(finalDailyMg)
                + " mg/dia";


            duration.textContent =
                treatmentDuration;


            formulaInfo.textContent =
                "Cálculo pelo componente amoxicilina: "
                + "90 mg/kg/dia, dividido em 2 tomas. "
                + "Máximo aplicado: 3000 mg/dia. "
                + "Apresentação selecionada: "
                + selected.label
                + " (" + selected.ratio + "). "
                + "*Na OMA recorrente ou falência terapêutica, "
                + "a duração indicada na fonte é 7 dias.";


            result.classList.remove("hidden");

            return;
        }


        // ==================================================
        // CHRONIC GAS CARRIER
        // ==================================================

        if (selectedIndication === "carrier") {

            /*
                Clinical rule encoded in this prototype:

                40 mg amoxicillin / kg / day

                Frequency:
                every 8 hours
                = 3 administrations/day

                Duration:
                10 days

                No numerical maximum was identified
                in the source used for this rule.
            */


            // --------------------------------------------------
            // 600 + 42.9 mg / 5 mL safeguards
            // --------------------------------------------------

            if (
                selectedFormulation === "600" &&
                totalMonths < 3
            ) {

                showMessage(
                    "Cálculo não suportado",
                    "A apresentação 600 mg + 42,9 mg / 5 mL utilizada nesta especificação não fornece recomendação para crianças com menos de 3 meses."
                );

                return;
            }


            if (
                selectedFormulation === "600" &&
                weight >= 40
            ) {

                showMessage(
                    "Cálculo não suportado",
                    "Para peso igual ou superior a 40 kg, este calculador não aplica a recomendação pediátrica da apresentação 600 mg + 42,9 mg / 5 mL."
                );

                return;
            }


            // --------------------------------------------------
            // CALCULATION
            // --------------------------------------------------

            const dailyMg =
                weight * 40;


            const amoxicillinPerDose =
                dailyMg / 3;


            const mlPerDose =
                amoxicillinPerDose /
                selected.amoxicillinMgPerMl;


            // --------------------------------------------------
            // DISPLAY RESULT
            // --------------------------------------------------

            doseMl.textContent =
                formatMl(mlPerDose);


            mgPerDose.textContent =
                formatMg(amoxicillinPerDose)
                + " mg";


            frequency.textContent =
                "8/8 horas";


            dailyDose.textContent =
                formatMg(dailyMg)
                + " mg/dia";


            duration.textContent =
                "10 dias";


            formulaInfo.textContent =
                "Cálculo pelo componente amoxicilina: "
                + "40 mg/kg/dia, dividido em 3 tomas. "
                + "A fonte utilizada não apresenta um máximo "
                + "numérico para este regime. "
                + "Utilizar apenas quando o médico já determinou "
                + "que está indicada a erradicação do estado "
                + "de portador crónico.";


            result.classList.remove("hidden");

            return;
        }

    }
);


// ======================================================
// PWA SERVICE WORKER REGISTRATION
// ======================================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register("./service-worker.js")

                .then(function (registration) {

                    console.log(
                        "PWA Service Worker registered successfully."
                    );

                })

                .catch(function (error) {

                    console.error(
                        "PWA Service Worker registration failed:",
                        error
                    );

                });

        }
    );

}