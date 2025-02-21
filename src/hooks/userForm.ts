import { useState, ChangeEvent } from 'react'

// フォームの値の型を定義
interface FormValues {
  [key: string]: string
}


interface UserFormProps<T> {
  initialValues: T
  onSubmit: (values: T) => void
  validate?: (values: T) => Partial<Record<keyof T, string>>
}


export function UserForm<T extends FormValues>({ 
  initialValues, 
  onSubmit, 
  validate 
}: UserFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    // 入力時にそのフィールドのエラーをクリア
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (validate) {
      const newErrors = validate(values)
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }


    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }


  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
  }


  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm
  }
}