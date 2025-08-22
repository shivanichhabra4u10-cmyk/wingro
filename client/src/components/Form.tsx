import React from 'react';
import { Formik, Form, useField } from 'formik';
import { Input } from './Input';
import { Button } from './Button';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Input
      {...field}
      {...props}
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

interface FormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validationSchema?: any;
  children: React.ReactNode;
  submitButton?: {
    text: string;
    props?: React.ComponentProps<typeof Button>;
  };
}

export function FormWrapper<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  submitButton = { text: 'Submit' }
}: FormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {children}
          <Button
            type="submit"
            isLoading={isSubmitting}
            {...submitButton.props}
          >
            {submitButton.text}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
