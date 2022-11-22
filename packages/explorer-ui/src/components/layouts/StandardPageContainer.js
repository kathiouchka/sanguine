export function StandardPageContainer({
  title,
  subtitle,
  children,
  rightContent,
}) {
  return (
    <main className="relative z-0 flex-1 h-full overflow-y-auto focus:outline-none">
      <div className="items-center px-4 py-8 mx-auto mt-4 2xl:w-1/2 sm:mt-6 sm:px-8 md:px-12 md:pb-14">
        <span
          className={`
            flex items-center
            text-3xl font-medium text-default
            bg-clip-text text-transparent bg-gradient-to-r
            from-purple-600 to-blue-600
          `}
        >
          {title}
        </span>
        {rightContent}
        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-600">
          {subtitle ?? ''}
        </div>
        {children}
      </div>
    </main>
  )
}