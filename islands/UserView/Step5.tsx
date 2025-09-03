import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import CheckboxInput from "../../components/ui/CheckboxInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import { useEffect } from "preact/hooks";
import { Step5Data } from "../../data/Step5/Step5Data.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";

export default function Step5(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue, formState: { errors } } = form;

  const preference = watch("preference");
  const howFind = watch("howFind");
  const interest = watch("interest");
  const courseType = watch("courseType");

  const data = useTranslations(Step5Data);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col">
          <CheckboxInput
            label={data.preference.label}
            name="preference"
            options={[
              {
                id: "reputation",
                value: "reputation",
                label: data.preference.options[0],
              },
              {
                id: "method",
                value: "method",
                label: data.preference.options[1],
              },
              {
                id: "indication",
                value: "indication",
                label: data.preference.options[2],
              },
              {
                id: "quality",
                value: "quality",
                label: data.preference.options[3],
              },
              {
                id: "flexibility",
                value: "flexibility",
                label: data.preference.options[4],
              },
              {
                id: "experience",
                value: "experience",
                label: data.preference.options[5],
              },
              {
                id: "results",
                value: "results",
                label: data.preference.options[6],
              },
              {
                id: "preferenceOther",
                value: "preferenceOther",
                label: data.preference.options[7],
              },
            ]}
            register={register("preference", {
              validate: (value) =>
                value?.length > 0 || data.preference.requiredError,
            })}
          />
          {errors.preference && (
            <span className="text-red-300 text-sm">
              {errors.preference.message}
            </span>
          )}
          {Array.isArray(preference) &&
            preference.includes("preferenceOther") && (
            <>
              <TextInput
                htmlFor="whichOthersPreferences"
                label={data.whichOthersPreferences.label}
                placeholder={data.whichOthersPreferences.placeholder}
                {...register("whichOthersPreferences", {
                  required: data.whichOthersPreferences.requiredError,
                })}
              />

              {errors.whichOthersPreferences && (
                <span className="text-red-300 text-xs">
                  {errors.whichOthersPreferences.message}
                </span>
              )}
            </>
          )}
          {Array.isArray(preference) &&
            preference.includes("indication") && (
            <TextInput
              htmlFor="whichIndicationPreferences"
              label={data.whichIndicationPreferences.label}
              placeholder={data.whichIndicationPreferences.placeholder}
              {...register("whichIndicationPreferences")}
            />
          )}
        </div>
        <div className="flex flex-col">
          <CheckboxInput
            label={data.howFind.label}
            name="howFind"
            options={[
              {
                id: "google",
                value: "google",
                label: data.howFind.options[0],
              },
              {
                id: "facebook",
                value: "facebook",
                label: data.howFind.options[1],
              },
              {
                id: "instagram",
                value: "instagram",
                label: data.howFind.options[2],
              },
              {
                id: "tiktok",
                value: "tiktok",
                label: data.howFind.options[3],
              },
              {
                id: "linkedin",
                value: "linkedin",
                label: data.howFind.options[4],
              },
              {
                id: "indication",
                value: "indication",
                label: data.howFind.options[5],
              },
              {
                id: "disclosure",
                value: "disclosure",
                label: data.howFind.options[6],
              },
              {
                id: "howFindOther",
                value: "howFindOther",
                label: data.howFind.options[7],
              },
            ]}
            register={register("howFind", {
              validate: (value) =>
                value?.length > 0 || data.howFind.requiredError,
            })}
          />
          {errors.howFind && (
            <span className="text-red-300 text-sm">
              {errors.howFind.message}
            </span>
          )}
          {Array.isArray(howFind) && howFind.includes("howFindOther") && (
            <>
              <TextInput
                htmlFor="whichOthersHowFind"
                label={data.whichOthersHowFind.label}
                placeholder={data.whichOthersHowFind.placeholder}
                {...register("whichOthersHowFind", {
                  required: data.whichOthersHowFind.requiredError,
                })}
              />
              {errors.whichOthersHowFind && (
                <span className="text-red-300 text-xs">
                  {errors.whichOthersHowFind.message}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-fit">
        <CheckboxInput
          label={courseType === "pff"
            ? data.interest.labelPff
            : data.interest.labelRegular}
          name="interest"
          options={[
            {
              id: "work",
              value: "work",
              label: data.interest.options[0],
            },
            { id: "trip", value: "trip", label: data.interest.options[1] },
            {
              id: "live",
              value: "live",
              label: courseType === "pff"
                ? data.interest.options[2]
                : data.interest.options[3],
            },
            {
              id: "learn",
              value: "learn",
              label: data.interest.options[4],
            },
            {
              id: "study",
              value: "study",
              label: data.interest.options[5],
            },
            {
              id: "interestOther",
              value: "interestOther",
              label: data.interest.options[6],
            },
          ]}
          register={register("interest", {
            validate: (value) =>
              value?.length > 0 || data.interest.requiredError,
          })}
        />
        {errors.interest && (
          <span className="text-red-300 text-sm">
            {errors.interest.message}
          </span>
        )}

        {Array.isArray(interest) && interest.includes("interestOther") && (
          <>
            <TextInput
              htmlFor="whichOthersInterest"
              label={data.whichOthersInterest.label}
              placeholder={data.whichOthersInterest.placeholder}
              {...register("whichOthersInterest", {
                required: data.whichOthersInterest.requiredError,
              })}
            />
            {errors.whichOthersInterest && (
              <span className="text-red-300 text-sm">
                {errors.whichOthersInterest.message}
              </span>
            )}
          </>
        )}
      </div>
    </FormStepLayout>
  );
}
