import { UseFormRegister } from 'react-hook-form'

export default function InputField<FormValuesT>({
  fieldName,
  label,
  register,
}: {
  fieldName: string
  label: string
  register: UseFormRegister<FormValuesT>
}) {
  return (
    <div className="p-6">
      <div className="form-control">
        <label className="label" htmlFor={fieldName}>
          <span className="label-text font-bold">{label}</span>
        </label>
        <input
          {...register(fieldName)}
          className="block box-border m-0 w-full rounded input input-bordered focus:input-primary"
        />
      </div>
    </div>
  )
}
