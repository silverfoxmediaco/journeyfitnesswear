import {redirect} from 'react-router';

export async function loader() {
  return redirect('/pages/about', 301);
}
