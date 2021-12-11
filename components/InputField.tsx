import { Path, UseFormRegister } from 'react-hook-form'

export default function InputField<FormValuesT>({
  fieldName,
  label,
  register,
  optional,
}: {
  fieldName: string
  label: string
  register: UseFormRegister<FormValuesT>
  optional: boolean
}) {
  return (
    <div className="m-3 w-80">
      <div className="form-control">
        <label className="label" htmlFor={fieldName}>
          <span className="label-text font-bold flex justify-between w-full">
            {label}
            {optional ? (
              <div className="badge badge-ghost">optional</div>
            ) : null}
          </span>
        </label>
        <input
          {...register(fieldName as Path<FormValuesT>)}
          className="block box-border m-0 w-full rounded input input-bordered focus:input-primary"
        />
      </div>
    </div>
  )
}
