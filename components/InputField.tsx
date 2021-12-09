export default function InputField({
  fieldName,
  label,
  register,
}: {
  fieldName: string
  label: string
  register: UseFormRegister<FormValues>
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