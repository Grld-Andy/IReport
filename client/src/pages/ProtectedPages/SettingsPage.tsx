import PageHeader from '@/components/custom/PageHeader'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppSelector } from '@/redux/app/hooks'
import { getCompanyPic } from '@/constants/getProfilePic'
import { getCompanyName } from '@/utils/getCompanyName'
import { getCategories } from '@/services/company/getCategories'
import { getTeams } from '@/services/company/getTeams'
import { createTeam } from '@/services/company/createTeams'
import { createCategories } from '@/services/company/createCategories'
import { updateCompany } from '@/services/company/updateCompany'
import { toast } from "sonner"
import { MdOutlineFlipCameraIos } from "react-icons/md";

interface Team {
  id?: string
  name: string
}

interface Category {
  id?: string
  name: string
}

interface CompanyInfo {
  name: string
  logoUrl: string
}

const SettingsPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [isEditing, setIsEditing] = useState(false)

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    logoUrl: ''
  })

  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [originalState, setOriginalState] = useState({
    companyInfo: { name: '', logoUrl: '' },
    teams: [] as Team[],
    categories: [] as Category[]
  })

  const [loading, setLoading] = useState(false)
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      setCompanyInfo({
        name: getCompanyName(user),
        logoUrl: getCompanyPic(user.companyPicUrl ?? "")
      })
    }
  }, [user])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoriesResult, teamsResult] = await Promise.all([
          getCategories(),
          getTeams()
        ])

        setTeams(teamsResult)
        setCategories(categoriesResult)

        setOriginalState({
          companyInfo: {
            name: user ? getCompanyName(user) : '',
            logoUrl: getCompanyPic(user?.companyPicUrl ?? "")
          },
          teams: teamsResult,
          categories: categoriesResult
        })
      } catch {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user])

  const hasChanges = useMemo(() => {
    if (newLogoFile) return true

    if (companyInfo.name !== originalState.companyInfo.name) return true

    if (teams.some(t => !t.id)) return true
    if (categories.some(c => !c.id)) return true

    return false
  }, [companyInfo, teams, categories, newLogoFile, originalState])

  const saveAll = async () => {
    setLoading(true)
    try {
      if (
        companyInfo.name !== originalState.companyInfo.name ||
        newLogoFile
      ) {
        await updateCompany({
          name: companyInfo.name,
          logo: newLogoFile ?? undefined
        })
      }

      const newTeams = teams.filter(t => !t.id && t.name.trim())
      if (newTeams.length) {
        await createTeam(newTeams.map(t => t.name))
      }

      const newCategories = categories.filter(c => !c.id && c.name.trim())
      if (newCategories.length) {
        await createCategories(newCategories.map(c => c.name))
      }

      setOriginalState({ companyInfo, teams, categories })
      setIsEditing(false)
      setNewLogoFile(null)

      toast.success("Settings saved successfully ✅")

    } catch (err) {
      console.error(err)
      toast.error("Failed to save changes ❌")
    } finally {
      setLoading(false)
    }
  }

  const discardChanges = () => {
    setCompanyInfo(originalState.companyInfo)
    setTeams(originalState.teams)
    setCategories(originalState.categories)
    setNewLogoFile(null)

    if (fileInputRef.current) fileInputRef.current.value = ''

    setIsEditing(false)
    toast("Changes discarded")
  }

  const handleLogoUpload = (file: File) => {
    setNewLogoFile(file)
    setCompanyInfo(prev => ({
      ...prev,
      logoUrl: URL.createObjectURL(file)
    }))
  }

  const addTeam = () => setTeams(prev => [...prev, { name: '' }])
  const addCategory = () => setCategories(prev => [...prev, { name: '' }])

  const deleteTeam = (index: number) => {
    setTeams(prev => prev.filter((_, i) => i !== index))
  }

  const deleteCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
      <PageHeader
        title="Settings"
        subtitle="Manage company data"
      />
      {
        !isEditing && (
            <Button className="bg-yellow-600 hover:bg-yellow-500" onClick={() => setIsEditing(true)}>Edit</Button>
          )
      }
      </div>

      {isEditing && hasChanges && (
        <div className="text-sm text-yellow-600 font-medium">
          You have unsaved changes
        </div>
      )}

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 items-start">
          <div className="relative">
            <img
              src={companyInfo.logoUrl}
              className="w-24 h-24 rounded border object-cover"
              onError={(e) => e.currentTarget.src = "/images/company_placeholder.avif"}
            />

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
                <MdOutlineFlipCameraIos/>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    handleLogoUpload(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          <div className="w-full">
            <Label>Company Name</Label>

            {isEditing ? (
              <Input
                value={companyInfo.name}
                onChange={(e) =>
                  setCompanyInfo(prev => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
              />
            ) : (
              <p className="mt-2">{companyInfo.name}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {teams.map((team, idx) => {
            const isNew = !team.id

            return (
              <div key={team.id ?? idx} className="flex gap-2">
                {isEditing && isNew ? (
                  <Input
                    value={team.name}
                    onChange={(e) => {
                      const updated = [...teams]
                      updated[idx].name = e.target.value
                      setTeams(updated)
                    }}
                  />
                ) : (
                  <p className="flex-1">{team.name}</p>
                )}

                {isEditing && isNew && (
                  <Button
                    variant="destructive"
                    onClick={() => deleteTeam(idx)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            )
          })}

          {isEditing && (
            <Button variant="outline" onClick={addTeam}>
              + Add Team
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {categories.map((cat, idx) => {
            const isNew = !cat.id

            return (
              <div key={cat.id ?? idx} className="flex gap-2">
                {isEditing && isNew ? (
                  <Input
                    value={cat.name}
                    onChange={(e) => {
                      const updated = [...categories]
                      updated[idx].name = e.target.value
                      setCategories(updated)
                    }}
                  />
                ) : (
                  <p className="flex-1">{cat.name}</p>
                )}

                {isEditing && isNew && (
                  <Button
                    variant="destructive"
                    onClick={() => deleteCategory(idx)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            )
          })}

          {isEditing && (
            <Button variant="outline" onClick={addCategory}>
              + Add Category
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={discardChanges}>
            Cancel
          </Button>
          <Button
            onClick={saveAll}
            disabled={loading || !hasChanges}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default SettingsPage