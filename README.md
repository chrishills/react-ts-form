# react-ts-form

Simple library for generating controlled form components based on typescript decorators.

```ts
// decorate fields on your data class
class SignUpFormData {

  @Input({
    component: TextInput,
    meta: {
      title: "Name",
      required: true
    }
  })
  public name: string;

  @Input({
    component: TextInput,
    meta: (value) => {

      const meta = {
        title: "Email",
        required: true
      };

      if (value && !EMAIL_REGEX.test(value)) {
        meta.feedback = 'Invalid email!';
        meta.intent = 'danger';
      }

      return meta;
    }
  })
  public email: string;

}

import { Form } from "react-ts-form";
import * as meta from "./my-form-templates";

function SignUpForm({onChange, value}) {
  return <Form clazz={SignUpFormData} value={value} onChange={onChange} meta={meta} />
}
```

