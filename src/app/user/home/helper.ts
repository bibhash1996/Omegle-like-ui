export function getInitials(fullName: string) {
  // Trim whitespace and split the name into parts
  const nameParts = fullName.trim().split(' ');

  // Handle cases based on the number of parts
  if (nameParts.length === 1) {
    // If there's only one part, return the first two letters
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[0].charAt(1).toUpperCase()
    );
  } else {
    // If there are multiple parts, return the initials of the first and last names
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
}
