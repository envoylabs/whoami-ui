import { themeChange } from 'theme-change'
import { useEffect, useState } from 'react'
import daisyuiThemes from 'styles/daisyui-themes.json'
import { LightBulbIcon as LightBulbIconDark } from '@heroicons/react/solid'
import { LightBulbIcon } from '@heroicons/react/outline'

const themes = Object.keys(daisyuiThemes) || ['']
export const defaultTheme = themes[0]

function ThemeToggle() {
  const [theme, setTheme] = useState(defaultTheme)
  useEffect(() => {
    themeChange(false)
    setTheme(
      document.documentElement.getAttribute('data-theme') || defaultTheme
    )
  }, [])

  return (
    <div className="form-control lg:mr-4 md:ml-auto">
      <label className="cursor-pointer label">
        <span className="label-text">
          <LightBulbIcon className="h-6 w-6" />
        </span>
        <input
          type="checkbox"
          className="toggle toggle-secondary mx-1"
          data-toggle-theme={themes.join(',')}
          data-act-class="active"
          checked={theme !== themes[0]}
          onClick={() =>
            setTheme(theme !== defaultTheme ? defaultTheme : themes[1])
          }
          readOnly
        />
        <span className="label-text">
          <LightBulbIconDark className="h-6 w-6" />
        </span>
      </label>
    </div>
  )
}

export default ThemeToggle
